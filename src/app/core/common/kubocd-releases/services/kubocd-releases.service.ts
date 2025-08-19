import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable } from '@angular/core';
import {
  catchError,
  distinctUntilChanged,
  interval,
  Observable,
  of,
  switchMap,
  forkJoin,
  map,
  concat,
  EMPTY,
  timer,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Catalog, Release } from '../../../../api/_model';
import { NotificationService } from '../../notifications';
import { KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS } from '../../../constants';
import {
  RELEASE_PHASE_ERROR,
  RELEASE_PHASE_READY,
  RELEASE_PHASE_SUSPENDED,
  RELEASE_PHASE_WAIT_DEPENDENCIES,
  RELEASE_PHASE_WAIT_HELM_RELEASES,
  RELEASE_PHASE_WAIT_HELM_REPO,
  RELEASE_PHASE_WAIT_OCI,
} from '../../../../model';
import { errorMessage } from '../../../../shared/utils';
import { CatalogService } from '../../catalogs';

@Injectable({
  providedIn: 'root',
})
export class KuboCDReleases {
  private instances: Release[] = [];
  private catalogs: Catalog[] = [];

  constructor(
    private readonly http: HttpClient,
    private notificationService: NotificationService,
    private catalogService: CatalogService,
    private destroyRef: DestroyRef
  ) {
    this.catalogService.catalogs$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          this.notificationService.onError('catalog', '', '', `Unable to fetch catalog, ${errorMessage(error)}`);
          return EMPTY;
        })
      )
      .subscribe((catalogs: Catalog[]) => {
        this.catalogs = catalogs;
      });
  }

  list(clusterId: string, namespace: string): Observable<Release[]> {
    return this.http.get<Release[]>(`/clusters/${clusterId}/namespaces/${namespace}/releases`);
  }

  getCatalog(release: Release): Catalog | undefined {
    const repo = release?.spec?.package?.repository;
    if (!repo) return undefined;
    const norm = (s: string) => s.replace(/\/+$/g, '');
    return this.catalogs.find(c => c.packages?.some(pkg => `${norm(c.repoUrl)}/${pkg.name}` === norm(repo)));
  }

  loadKuboCDReleases(clusterId: string, namespaces: string[]): Observable<Release[]> {
    return forkJoin(namespaces.map(ns => this.list(clusterId, ns))).pipe(
      map(allReleases => allReleases.flat()),
      catchError(error => {
        this.notificationService.onError('KuboCD', '', '', `Failed to fetch kubocd releases, ${errorMessage(error)}`);
        return of([]);
      })
    );
  }

  startPollServicesChange(clusterId: string, namespaces: string[]): Observable<Release[]> {
    return concat(EMPTY, timer(0), interval(KUBOCD_RELEASES_FETCH_POLLING_INTERVAL_MS)).pipe(
      switchMap(() =>
        forkJoin(
          namespaces.map(ns =>
            this.list(clusterId, ns).pipe(
              catchError(error => {
                this.notificationService.onError(
                  'KuboCD',
                  '',
                  '',
                  `Failed to poll kubocd releases from namespace "${ns}", ${errorMessage(error)}`
                );
                return of([]);
              })
            )
          )
        )
      ),
      map(results => results.flat()),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );
  }

  updateInstances(releases: Release[], notify: boolean): void {
    const { updatedInstances, newInstances, deletedInstances } = this.compareInstances(this.instances, releases);

    if (notify) {
      if (newInstances.length > 0) {
        newInstances.forEach(s => {
          const name = s.metadata.name;
          const namespace = s.metadata.namespace;
          const phase = s.status?.phase?.toUpperCase() ?? 'UNKNOWN';
          const creationTimestamp = s.metadata.creationTimestamp;
          const catalogId = this.getCatalog(s)?.id || '';
          switch (phase) {
            case RELEASE_PHASE_READY:
              this.notificationService.onSuccess(
                `${name}`,
                `${namespace}`,
                catalogId,
                'was successfully deployed.',
                creationTimestamp
              );
              break;
            case RELEASE_PHASE_ERROR:
              this.notificationService.onError(
                `${name}`,
                `${namespace}`,
                catalogId,
                'was failed to deploy.',
                creationTimestamp
              );
              break;
            case RELEASE_PHASE_WAIT_OCI:
              this.notificationService.onInfo(
                `${name}`,
                `${namespace}`,
                catalogId,
                'is waiting for OCI.',
                creationTimestamp
              );
              break;
            case RELEASE_PHASE_WAIT_HELM_REPO:
              this.notificationService.onInfo(
                `${name}`,
                `${namespace}`,
                catalogId,
                'is waiting for Helm repository.',
                creationTimestamp
              );
              break;
            case RELEASE_PHASE_WAIT_HELM_RELEASES:
              this.notificationService.onInfo(
                `${name}`,
                `${namespace}`,
                catalogId,
                'is waiting for helm release deplyment.',
                creationTimestamp
              );
              break;
            case RELEASE_PHASE_WAIT_DEPENDENCIES:
              this.notificationService.onInfo(
                `${name}`,
                `${namespace}`,
                catalogId,
                'is waiting for dependencies.',
                creationTimestamp
              );
              break;
            case RELEASE_PHASE_SUSPENDED:
              this.notificationService.onWarning(
                `${name}`,
                `${namespace}`,
                catalogId,
                'is suspended.',
                creationTimestamp
              );
              break;
            case undefined:
            default:
              this.notificationService.onWarning(
                `${name}`,
                `${namespace}`,
                catalogId,
                'Unknown status phase.',
                creationTimestamp
              );
          }
        });
      }

      if (deletedInstances.length > 0) {
        deletedInstances.forEach(s =>
          this.notificationService.onWarning(`${s.metadata.name}`, `${s.metadata.namespace}`, '', 'was removed !')
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

  clearAll(): void {
    this.instances = [];
  }
}
