import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KuboCDReleases } from '../../../../core/common/kubocd-releases';
import { Catalog, Release } from '../../../../api/_model';
import { AppConfigService } from '../../../../core/config';
import { EndpointsFromUsagePipe } from '../../../../shared/pipes';
import { ReleaseInstance } from '../../../../model';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { LoadingComponent } from '../../../../shared/components/loading';
import { SidebarService } from '../../../../core/layout/sidebar';
import { AppState } from '../../../../core/store';
import { getClusterId } from '../../../../core/common/clusters';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { SearchFilterService } from '../../../../shared/components/search-filter';
import { NotificationService } from '../../../../core/common/notifications';
import { errorMessage } from '../../../../core/models';
import { CatalogService } from '../../../../core/common/catalogs';

@Component({
  selector: 'app-release-instances',
  standalone: true,
  imports: [CommonModule, LoadingComponent, KebabMenuComponent],
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
    this.store.pipe(select(getClusterId), takeUntilDestroyed(this.destroyRef)).subscribe(clusterId => {
      if (clusterId) {
        this.isLoaded = false;
        this.kubocdReleases.loadKuboCDReleases(clusterId, ["default", "kubocd"]); //NS
        this.kubocdReleases.startPollServicesChange(clusterId, "default"); //NS
      }
    });

    this.route.paramMap.subscribe(params => {
      var catalogId = params.get('service') || '-';
      this.catalogService.get(catalogId).subscribe(catalog => {
        this.currentCatalog = catalog;
        this.currentCatalogPackages = this.currentCatalog.packages.map(
          pkg => `${this.currentCatalog.repoUrl}/${pkg.name}`
        );
        this.toInstances();
      });
    });

    this.kubocdReleases.services$.subscribe(services => {
      this.releases = services;
      console.log("============>", services)
      this.toInstances();
      this.isLoaded = services.length > 0;
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
          ({
            release: s,
            icon: this.appConfigService.kadServicesInfo(s.metadata.name!).icon!,
            description: this.appConfigService.kadServicesInfo(s.metadata.name!).description!,
            endpoint: ""
              //this.endpointsFromUsagePipe.transform(s.find(c => c.usage !== '')?.usage || '')[0] || '',
          }) as ReleaseInstance
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
