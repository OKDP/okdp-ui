import { DestroyRef, inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, EMPTY, filter, interval, map, of, switchMap, take, takeWhile, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../../core/common/notifications';
import { AppState } from '../../../../../core/store';
import { Catalog, Release, ServerResponse } from '../../../../../api/_model';
import { ReleaseInstance, STATUS_UNKNOWN, ToStatusView } from '../../../../../model';
import { getClusterId } from '../../../../../core/common/clusters';
import { getProjectName } from '../../../../../core/common/projects';
import { KuboCDReleases } from '../../../../../core/common/kubocd-releases';
import { CatalogService } from '../../../../../core/common/catalogs';
import { SearchFilterService } from '../../../../../shared/components/search-filter';
import { TitleBarService } from '../../../../../shared/components/content-header-title';
import { SidebarService } from '../../../../../core/layout/sidebar';
import { EndpointsFromUsagePipe } from '../../../../../shared/pipes';
import { errorMessage } from '../../../../../core/models';
import { AppConfigService } from '../../../../../core/config';
import { GitReleaseService } from '../../../services/git-release.service';
import { K8sReleaseService } from '../../../services/k8s-release.service';

@Injectable()
export abstract class AbstractReleaseBaseComponent {
  protected readonly kubocdReleases = inject(KuboCDReleases);
  protected readonly catalogService = inject(CatalogService);
  protected readonly  gitReleaseService = inject(GitReleaseService);
  protected readonly  k8sReleaseService = inject(K8sReleaseService);
  protected readonly searchFilterService = inject(SearchFilterService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly titleBarService = inject(TitleBarService);
  protected readonly endpointsFromUsagePipe = inject(EndpointsFromUsagePipe);
  protected readonly sidebarService = inject(SidebarService);
  protected readonly appConfigService = inject(AppConfigService);
  protected readonly store = inject<Store<AppState>>(Store<AppState>);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected isLoaded = false;

  protected releases: Release[] = [];
  protected currentCatalog: Catalog = {} as Catalog;
  protected currentCatalogPackages: string[] = [];
  
  currentProjectName: string;
  currentClusterId: string;
  submissionMode: string;

  // Deletion
  protected showDialog = false;
  protected selectedRelease: string = '';

  // Filter
  protected instances: ReleaseInstance[] = [];
  protected filtredInstances: ReleaseInstance[] = [];
  search = '';

  abstract updateDataSource(instances: ReleaseInstance[]): void;

  onInit(): void {
    this.isLoaded = false;
    this.submissionMode = this.appConfigService.getSubmissionMode();

    combineLatest([
      this.store.pipe(select(getClusterId)),
      this.store.pipe(select(getProjectName)),
      this.route.parent!.paramMap.pipe(
        map(params => params.get('service') || '-'),
        switchMap(catalogId => this.catalogService.listById(catalogId))
      )
    ])
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(([clusterId, projectName, catalog]) => Boolean(clusterId && projectName && catalog)),
      switchMap(([clusterId, projectName, catalog]) => {
        this.currentClusterId = clusterId;
        this.currentProjectName = projectName;
        this.currentCatalog = catalog;
        this.currentCatalogPackages = catalog.packages.map(pkg => `${catalog.repoUrl}/${pkg.name}`);
        this.titleBarService.setCurrentMenu(catalog.id);
        this.sidebarService.setActiveMenu(catalog.id);
        this.isLoaded = false;
    
        return this.kubocdReleases.loadKuboCDReleases(clusterId, [projectName]);
      }),
      tap(releases => {
        this.releases = releases;
        this.instances = this.loadInstances();
        this.updateDataSource(this.instances);
        this.searchChanged(this.search);
        this.isLoaded = true;
      }),
      catchError(err => {
        this.notificationService.onError('Namespaces', `Failed to load namespaces: ${err.message || err}`);
        this.isLoaded = true;
        return EMPTY;
      })
    )
    .subscribe();
    
    this.searchFilterService.globalSearchFilter$.subscribe({
      next: (search: string) => {
        this.searchChanged(search);
      },
      error: error => {
        this.notificationService.onError('search', `Search error, ${errorMessage(error)}`);
      },
    });
  }

  loadInstances(): ReleaseInstance[] {
    return this.releases
      .filter(s => this.currentCatalogPackages.includes(s.spec.package.repository))
      .map(r => {
        const [statusLabel, statusIcon] = ToStatusView(r.status?.phase);
        return {
          ...r,
          icon: this.appConfigService.kadServicesInfo(r.metadata.name!).icon!,
          description: this.appConfigService.kadServicesInfo(r.metadata.name!).description!,
          endpoint: this.endpointsFromUsagePipe.transform(r.status?.usage)?.[0] || '',
          statusText: r.status?.phase || STATUS_UNKNOWN,
          statusIcon,
          statusLabel,
        };
      })
      .sort((a, b) => a.metadata.name!.localeCompare(b.metadata.name!));
  }

  searchChanged(search: string): void {
    this.search = search;
    if (!search) {
      this.filtredInstances = this.instances;
    } else {
      this.filtredInstances = this.instances.filter(
        instance =>
          instance.metadata.name!.toLowerCase().includes(search.toLowerCase()) ||
          instance.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    this.updateDataSource(this.filtredInstances);
  }

  protected onDeleteRelease(name: string) {
    this.selectedRelease = name;
    this.showDialog = true;
  }

  onConfirmDelete() {
    this.showDialog = false;

    if (!this.selectedRelease) return;

    this.delete(this.selectedRelease);

    this.selectedRelease = '';
  }

  onCancelDelete() {
    this.showDialog = false;
    this.selectedRelease = '';
  }

  delete(name: string) {
    const deleteHandler = {
      git: () => this.gitReleaseService.delete(this.currentClusterId, 'flux-system', 'releases-system', name),
      kubernetes: () => this.k8sReleaseService.delete(this.currentClusterId, this.currentProjectName, name),
    }[this.submissionMode]();

    deleteHandler
      .pipe(
        switchMap(() =>
          interval(2000).pipe(
            switchMap(() =>
              this.kubocdReleases
                .loadKuboCDReleases(this.currentClusterId, [this.currentProjectName])
                .pipe(map(releases => ({ releases, found: releases.find(r => r.metadata.name === name) })))
            ),
            takeWhile(result => !!result.found, true),
            filter(result => !result.found),
            take(1),
            tap(result => {
              this.releases = result.releases;
              this.instances = this.loadInstances();
              this.updateDataSource(this.instances);
              this.searchChanged(this.search);
              this.notificationService.onSuccess(
                `${name}/${this.currentProjectName}`,
                `was successfully deleted from ${this.submissionMode === 'git' ? 'Git' : 'Kubernetes'}.`
              );
            }),
            catchError(error => {
              this.notificationService.onError(
                `${name}/${this.currentProjectName}`,
                `Polling failed: ${errorMessage(error)}`
              );
              return of(null);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: error => {
          this.notificationService.onError(
            `${name}/${this.currentProjectName}`,
            `Delete failed: ${errorMessage(error)}`
          );
        },
      });
  }

  edit(name: string) {}

  add(): void {
    this.router.navigate([`/services/${this.currentCatalog.id}/select`]);
  }

}
