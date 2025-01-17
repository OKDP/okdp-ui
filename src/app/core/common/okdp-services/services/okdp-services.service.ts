import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, interval, Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Service } from '../../../../api/_model';
import { NotificationService } from '../../notifications';
import { OKDP_SERVICES_FETCH_POLLING_INTERVAL_MS } from '../../../constants';
import { errorMessage } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class OKDPServices {
  private services = new BehaviorSubject<Service[]>([]);
  public services$ = this.services.asObservable();

  private instances: Service[] = [];

  constructor(
    private readonly http: HttpClient,
    private notificationService: NotificationService,
    private destroyRef: DestroyRef
  ) {}

  list(kadInstanceId: string): Observable<Service[]> {
    return this.http
      .get<Service[]>(`/kad/${kadInstanceId}/services`)
      .pipe(tap(services => this.services.next(services)));
  }

  loadOKDPServices(kadInstanceId: string): void {
    this.list(kadInstanceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: services => this.updateInstances(services, false),
        error: error =>
          this.notificationService.onError('Services', `Failed to fetch okdp services, ${errorMessage(error)}`),
      });
  }

  startPollServicesChange(kadInstanceId: string): void {
    interval(OKDP_SERVICES_FETCH_POLLING_INTERVAL_MS)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.list(kadInstanceId)),
        catchError(error => {
          this.notificationService.onError('Services', `Failed to poll okdp services, ${errorMessage(error)}`);
          return of([]);
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(services => {
        this.updateInstances(services, true);
      });
  }

  updateInstances(services: Service[], notify: boolean): void {
    const { updatedInstances, newInstances, deletedInstances } = this.compareInstances(this.instances, services);

    if (notify) {
      if (newInstances.length > 0) {
        newInstances.forEach(s => this.notificationService.onSuccess(s.name, 'was successfully deployed.'));
      }

      if (deletedInstances.length > 0) {
        deletedInstances.forEach(s => this.notificationService.onInfo(s.name, 'was removed !'));
      }
    }

    this.instances = [...updatedInstances];
  }

  compareInstances(
    oldInstances: Service[],
    newInstances: Service[]
  ): { updatedInstances: Service[]; newInstances: Service[]; deletedInstances: Service[] } {
    const updatedInstancesList = [...oldInstances];
    const newInstancesList: Service[] = [];
    const deletedInstancesList: Service[] = [];

    newInstances.forEach(newInstance => {
      const existingMenuIndex = oldInstances.findIndex(oldInstance => oldInstance.name === newInstance.name);

      if (existingMenuIndex === -1) {
        newInstancesList.push(newInstance);
        updatedInstancesList.push(newInstance);
      } else {
        updatedInstancesList[existingMenuIndex] = newInstance;
      }
    });

    oldInstances.forEach(oldInstance => {
      if (!newInstances.some(newInstance => newInstance.name === oldInstance.name)) {
        deletedInstancesList.push(oldInstance);
      }
    });

    return {
      updatedInstances: updatedInstancesList,
      newInstances: newInstancesList,
      deletedInstances: deletedInstancesList,
    };
  }
}
