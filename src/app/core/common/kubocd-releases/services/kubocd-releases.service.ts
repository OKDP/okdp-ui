import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  interval,
  Observable,
  of,
  switchMap,
  forkJoin,
  skip,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Release } from '../../../../api/_model';
import { NotificationService } from '../../notifications';
import { KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS } from '../../../constants';
import { errorMessage } from '../../../models';
import {
  ReleasePhaseError,
  ReleasePhaseReady,
  ReleasePhaseSuspended,
  ReleasePhaseWaitDependencies,
  ReleasePhaseWaitHelmReleases,
  ReleasePhaseWaitHelmRepo,
  ReleasePhaseWaitOci,
} from '../../../../model';

@Injectable({
  providedIn: 'root',
})
export class KuboCDReleases {
  private releases = new BehaviorSubject<Release[]>([]);
  public releases$ = this.releases.asObservable();

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
          this.releases.next(combined);
          this.updateInstances(combined, false);
        },
        error: error =>
          this.notificationService.onError('KuboCD', `Failed to fetch kubocd releases, ${errorMessage(error)}`),
      });
  }

  startPollServicesChange(clusterId: string, namespaces: string[]): void {
    interval(KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS)
      .pipe(
        skip(1),
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          forkJoin(
            namespaces.map(ns =>
              this.list(clusterId, ns).pipe(
                catchError(error => {
                  this.notificationService.onError(
                    'KuboCD',
                    `Failed to poll kubocd releases from namespace "${ns}", ${errorMessage(error)}`
                  );
                  return of([]);
                })
              )
            )
          )
        ),
        switchMap(results => of(results.flat())),
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
        newInstances.forEach(s => {
          const name = s.metadata.name;
          const namespace = s.metadata.namespace;
          const phase = s.status?.phase?.toUpperCase() ?? 'UNKNOWN';
          switch (phase) {
            case ReleasePhaseReady:
              this.notificationService.onSuccess(`${name}/${namespace}`, 'was successfully deployed.');
              break;
            case ReleasePhaseError:
              this.notificationService.onError(`${name}/${namespace}`, 'was failed to deploy.');
              break;
            case ReleasePhaseWaitOci:
              this.notificationService.onInfo(`${name}/${namespace}`, 'is waiting for OCI.');
              break;
            case ReleasePhaseWaitHelmRepo:
              this.notificationService.onInfo(`${name}/${namespace}`, 'is waiting for Helm repository.');
              break;
            case ReleasePhaseWaitHelmReleases:
              this.notificationService.onInfo(`${name}/${namespace}`, 'is waiting for helm release deplyment.');
              break;
            case ReleasePhaseWaitDependencies:
              this.notificationService.onInfo(`${name}/${namespace}`, 'is waiting for dependencies.');
              break;
            case ReleasePhaseSuspended:
              this.notificationService.onWarning(`${name}/${namespace}`, 'is suspended.');
              break;
            case undefined:
            default:
              this.notificationService.onWarning(`${name}/${namespace}`, 'Unknown status phase.');
          }
        });
      }

      if (deletedInstances.length > 0) {
        deletedInstances.forEach(s =>
          this.notificationService.onWarning(`${s.metadata.name}/${s.metadata.namespace}`, 'was removed !')
        );
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
      const existingMenuIndex = oldInstances.findIndex(
        oldInstance =>
          oldInstance.metadata.name === newInstance.metadata.name &&
          oldInstance.metadata.namespace === newInstance.metadata.namespace
      );
      if (existingMenuIndex === -1) {
        newInstancesList.push(newInstance);
        updatedInstancesList.push(newInstance);
      } else {
        updatedInstancesList[existingMenuIndex] = newInstance;
      }
    });
    oldInstances.forEach(oldInstance => {
      if (
        !newInstances.some(
          newInstance =>
            newInstance.metadata.name === oldInstance.metadata.name &&
            newInstance.metadata.namespace === oldInstance.metadata.namespace
        )
      ) {
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
