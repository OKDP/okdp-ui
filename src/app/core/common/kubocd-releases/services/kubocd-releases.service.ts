import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, interval, Observable, of, switchMap, forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Release } from '../../../../api/_model';
import { NotificationService } from '../../notifications';
import { KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS } from '../../../constants';
import { errorMessage } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class KuboCDReleases {
  private services = new BehaviorSubject<Release[]>([]);
  public services$ = this.services.asObservable();

  private instances: Release[] = [];

  constructor(
    private readonly http: HttpClient,
    private notificationService: NotificationService,
    private destroyRef: DestroyRef
  ) {}

  list(clusterId: string, namespace: string): Observable<Release[]> {
    return this.http.get<Release[]>(`/clusters/${clusterId}/namespaces/${namespace}/releases`);
  }

  loadKuboCDReleases(clusterId: string, namespaces: string[]): void {
    forkJoin(namespaces.map(ns => this.list(clusterId, ns)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: allReleases => {
          const combined = allReleases.flat();
          this.services.next(combined); // Now emit combined releases
          this.updateInstances(combined, false);
        },
        error: error =>
          this.notificationService.onError('KuboCD', `Failed to fetch kubocd releases, ${errorMessage(error)}`),
      });
  }

  startPollServicesChange(clusterId: string, namespace: string): void {
    interval(KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.list(clusterId, namespace)),
        catchError(error => {
          this.notificationService.onError('Services', `Failed to poll okdp services, ${errorMessage(error)}`);
          return of([]);
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(releases => {
        this.updateInstances(releases, true);
      });
  }

  updateInstances(releases: Release[], notify: boolean): void {
    const { updatedInstances, newInstances, deletedInstances } = this.compareInstances(this.instances, releases);

    if (notify) {
      if (newInstances.length > 0) {
        newInstances.forEach(s => this.notificationService.onSuccess(s.metadata.name!, 'was successfully deployed.'));
      }

      if (deletedInstances.length > 0) {
        deletedInstances.forEach(s => this.notificationService.onWarning(s.metadata.name!, 'was removed !'));
      }
    }

    this.instances = [...updatedInstances];
  }

  compareInstances(
    oldInstances: Release[],
    newInstances: Release[]
  ): { updatedInstances: Release[]; newInstances: Release[]; deletedInstances: Release[] } {
    const updatedInstancesList = [...oldInstances];
    const newInstancesList: Release[] = [];
    const deletedInstancesList: Release[] = [];

    newInstances.forEach(newInstance => {
      const existingMenuIndex = oldInstances.findIndex(oldInstance => oldInstance.metadata.name === newInstance.metadata.name 
        && oldInstance.metadata.namespace === newInstance.metadata.namespace);
      if (existingMenuIndex === -1) {
        newInstancesList.push(newInstance);
        updatedInstancesList.push(newInstance);
      } else {
        updatedInstancesList[existingMenuIndex] = newInstance;
      }
    });

    oldInstances.forEach(oldInstance => {
      if (!newInstances.some(newInstance => newInstance.metadata.name === oldInstance.metadata.name 
        && newInstance.metadata.namespace === oldInstance.metadata.namespace)) {
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
