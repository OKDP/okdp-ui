import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, filter, switchMap, tap } from 'rxjs';
import { KuboCDReleases } from '../../../../core/common/kubocd-releases';
import { Catalog, Release } from '../../../../api/_model';
import { AppConfigService } from '../../../../core/config';
import { EndpointsFromUsagePipe, TitleCasePipe } from '../../../../shared/pipes';
import { ReleaseInstance } from '../../../../model';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { LoadingComponent } from '../../../../shared/components/loading';
import { SidebarService } from '../../../../core/layout/sidebar';
import { AppState } from '../../../../core/store';
import { ClusterService, getClusterId } from '../../../../core/common/clusters';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { SearchFilterService } from '../../../../shared/components/search-filter';
import { NotificationService } from '../../../../core/common/notifications';
import { errorMessage } from '../../../../core/models';
import { CatalogService } from '../../../../core/common/catalogs';

@Component({
  selector: 'app-release-instances',
  standalone: true,
  imports: [CommonModule, LoadingComponent, KebabMenuComponent, TitleCasePipe],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-instances.component.html',
  styleUrls: ['./release-instances.component.scss'],
  animations: [],
})
export class ReleaseInstancesComponent implements OnInit {
  isLoaded = false;

  private releases: Release[] = [];
  private currentCatalog: Catalog = {} as Catalog;
  private currentCatalogPackages: string[];

  instances: ReleaseInstance[] = [];
  filtredInstances: ReleaseInstance[] = [];

  search = '';

  constructor(
    private catalogService: CatalogService,
    private kubocdReleases: KuboCDReleases,
    private clusterService: ClusterService,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService,
    private searchFilterService: SearchFilterService,
    private store: Store<AppState>,
    private endpointsFromUsagePipe: EndpointsFromUsagePipe,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.isLoaded = false;
    this.store
      .pipe(
        select(getClusterId),
        takeUntilDestroyed(this.destroyRef),
        filter((clusterId): clusterId is string => Boolean(clusterId)),
        tap(clusterId => {
          this.kubocdReleases.loadKuboCDReleases(clusterId, ['default', 'kubocd', 'kubocd-system']); // NS
          this.isLoaded = false;
        }),
        catchError(err => {
          this.notificationService.onError('Namespaces', `Failed to load namespaces: ${err.message || err}`);
          this.isLoaded = false;
          return EMPTY;
        })
      )
      .subscribe();

    this.route.paramMap
      .pipe(
        switchMap(params => {
          const catalogId = params.get('service') || '-';
          return this.catalogService.listById(catalogId);
        })
      )
      .subscribe(catalog => {
        this.currentCatalog = catalog;
        this.currentCatalogPackages = catalog.packages.map(pkg => `${catalog.repoUrl}/${pkg.name}`);
        this.toInstances();
      });

    this.kubocdReleases.releases$.subscribe(releases => {
      this.releases = releases;
      this.toInstances();
      this.isLoaded = releases.length > 0;
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

  toInstances() {
    this.titleBarService.setCurrentMenu(this.currentCatalog.id);
    this.sidebarService.setActiveMenu(this.currentCatalog.id);
    this.instances = this.releases
      .filter(s => this.currentCatalogPackages.includes(s.spec.package.repository))
      .map(
        s =>
          new ReleaseInstance(
            s,
            this.appConfigService.kadServicesInfo(s.metadata.name!).icon!,
            this.appConfigService.kadServicesInfo(s.metadata.name!).description!,
            this.endpointsFromUsagePipe.transform(s.status?.usage)?.[0] || ''
          ) as ReleaseInstance
      )
      .sort((a, b) => a.release.metadata.name!.localeCompare(b.release.metadata.name!));
    this.searchChanged(this.search);
  }

  searchChanged(search: string): void {
    this.search = search;
    if (!search) {
      this.filtredInstances = this.instances;
    } else {
      this.filtredInstances = this.instances.filter(
        instance =>
          instance.release.metadata.name!.toLowerCase().includes(search.toLowerCase()) ||
          instance.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  highlightMatch(item: string | undefined): string | undefined {
    if (!this.search) return item;
    const query = this.search;
    const regex = new RegExp(`(${query})`, 'gi');
    return item?.replace(regex, '<mark class="text-okdp text-nowrap">$1</mark>');
  }
}
