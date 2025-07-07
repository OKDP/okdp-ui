import { DestroyRef, inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, EMPTY, filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../../core/common/notifications';
import { AppState } from '../../../../../core/store';
import { Catalog, Release } from '../../../../../api/_model';
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

@Injectable()
export abstract class AbstractReleaseBaseComponent {
  protected readonly kubocdReleases = inject(KuboCDReleases);
  protected readonly catalogService = inject(CatalogService);
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
  protected currentProjectName: string;

  // Filter
  protected instances: ReleaseInstance[] = [];
  protected filtredInstances: ReleaseInstance[] = [];
  search = '';

  abstract updateDataSource(instances: ReleaseInstance[]): void;

  onInit(): void {
    this.isLoaded = false;

    combineLatest([this.store.pipe(select(getClusterId)), this.store.pipe(select(getProjectName))])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(([clusterId, projectName]) => Boolean(clusterId && projectName)),
        tap(() => {
          this.isLoaded = false;
        }),
        switchMap(([clusterId, projectName]) => this.kubocdReleases.loadKuboCDReleases(clusterId, [projectName])),
        tap(releases => {
          this.releases = releases;
          if (releases.length > 0) {
            this.loadInstances();
          }
          this.isLoaded = true;
        }),
        catchError(err => {
          this.notificationService.onError('Namespaces', `Failed to load namespaces: ${err.message || err}`);
          this.isLoaded = false;
          return EMPTY;
        })
      )
      .subscribe();

    // combineLatest([this.store.pipe(select(getClusterId)), this.store.pipe(select(getProjectName))])
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     filter(([clusterId, projectName]) => Boolean(clusterId && projectName)),
    //     tap(() => {
    //       this.isLoaded = false;
    //     }),
    //     switchMap(([clusterId, projectName]) => of(this.kubocdReleases.loadKuboCDReleases(clusterId, [projectName]))),
    //     tap(() => {
    //       this.isLoaded = true;
    //     }),
    //     catchError(err => {
    //       this.notificationService.onError('Namespaces', `Failed to load namespaces: ${err.message || err}`);
    //       this.isLoaded = false;
    //       return EMPTY;
    //     })
    //   )
    //   .subscribe();

    //   this.kubocdReleases.releases$.subscribe(releases => {
    //     if (releases.length > 0) {
    //       this.releases = releases;
    //       this.loadInstances();
    //     }
    //     this.isLoaded = true;
    //   });

    this.route.parent?.paramMap
      .pipe(
        switchMap(params => {
          const catalogId = params.get('service') || '-';
          return this.catalogService.listById(catalogId);
        })
      )
      .subscribe(catalog => {
        this.currentCatalog = catalog;
        this.currentCatalogPackages = catalog.packages.map(pkg => `${catalog.repoUrl}/${pkg.name}`);
        this.loadInstances();
      });

    this.searchFilterService.globalSearchFilter$.subscribe({
      next: (search: string) => {
        this.searchChanged(search);
      },
      error: error => {
        this.notificationService.onError('search', `Search error, ${errorMessage(error)}`);
      },
    });
  }

  loadInstances() {
    this.titleBarService.setCurrentMenu(this.currentCatalog.id);
    this.sidebarService.setActiveMenu(this.currentCatalog.id);
    this.instances = this.releases
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
    this.updateDataSource(this.instances);
    this.searchChanged(this.search);
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

  delete(name: string) {}

  edit(name: string) {}

  add(): void {
    this.router.navigate([`/services/${this.currentCatalog.id}/select`]);
  }
}
