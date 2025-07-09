import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchFilterComponent, SearchFilterService } from '../../../../shared/components/search-filter';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs';
import { CatalogService } from '../../../../core/common/catalogs';
import { Catalog } from '../../../../api/_model';
import { CATALOG_URI } from '../../../../core/constants';
import { toUri } from '../../../../shared/utils';
import { CatalogItem } from '../../../../model/catalog.model';
import { AppConfigService } from '../../../../core/config';
import { LoadingComponent } from '../../../../shared/components/loading';
import { TitleBarService } from '../../../../shared/components/content-header-title';
import { SidebarService } from '../../../../core/layout/sidebar';
import { NotificationService } from '../../../../core/common/notifications';
import { errorMessage } from '../../../../core/models';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { ContentToolbarComponent } from '../../../../shared/components/content-toolbar';

@Component({
  selector: 'app-catalog-list-packages',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgScrollbarModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent,
    NavTabsComponent,
    KebabMenuComponent,
    SearchFilterComponent,
    ContentToolbarComponent,
  ],
  templateUrl: './catalog-list-packages.component.html',
  styleUrls: ['./catalog-list-packages.component.scss'],
  animations: [],
})
export class CatalogListPackagesComponent implements OnInit {
  catalogIds: string[] = [];
  navTabDisplayClass = '';

  catalogs: Catalog[] = [];
  isLoaded = false;

  catalogItems: CatalogItem[] = [];
  filtredCatalogItems: CatalogItem[] = [];

  currentCatalogId = '';

  search = '';

  isShowSystemCatalog = false;

  filterKadCatalogs: string[] = [];

  constructor(
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private searchFilterService: SearchFilterService,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleBarService.setCurrentMenu('catalogs');
    this.sidebarService.setActiveMenu('catalogs');
    this.filterKadCatalogs = this.appConfigService.catalogs().kad;

    this.loadCatalogs();

    this.route.paramMap.subscribe(params => {
      this.currentCatalogId = params.get('catalog') || '';
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

  loadCatalogs(): void {
    this.catalogService.catalogs$.subscribe({
      next: (catalogs: Catalog[]) => {
        this.catalogs = catalogs
          .filter(c => this.filterKadCatalogs.includes(c.id) || this.filterKadCatalogs.includes('all'))
          .sort((e1, e2) => e1.id.toLowerCase().localeCompare(e2.id.toLowerCase()));
        this.catalogIds = this.catalogs.map(c => c.id);
        this.catalogItems = this.catalogs.flatMap(c => this.toCatalogItems(c));
        this.searchChanged(this.search);
        this.isLoaded = true;
        this.toCurrentCatalogCatalog();
      },
      error: error => {
        this.notificationService.onError('catalog', `Unable to fetch catalog, ${errorMessage(error)}`);
      },
    });
  }

  onCatalogChange(catalogId: string): void {
    this.filtredCatalogItems = this.getCatalogItems(catalogId);
  }

  onDeployService(item: CatalogItem): void {
    this.router.navigate([`/services/${item.name}/create`], {
      queryParams: { catalog: item.catalogId },
    });
  }

  searchChanged(search: string): void {
    this.search = search;
    if (!search) {
      this.navTabDisplayClass = '';
      this.toCurrentCatalogCatalog();
    } else {
      this.navTabDisplayClass = 'd-none';
      this.filtredCatalogItems = this.catalogItems.filter(
        item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  highlightMatch(item: string | undefined): string | undefined {
    if (!this.search) return item;
    const query = this.search;
    const regex = new RegExp(`(${query})`, 'gi');
    return item?.replace(regex, '<mark class="text-okdp text-nowrap">$1</mark>');
  }

  private toCatalogItems(catalog: Catalog): CatalogItem[] {
    let catalogItems: CatalogItem[] = [];

    let packages =
      (catalog?.packages.map(c => ({
        catalogId: catalog?.id,
        catalogName: catalog?.name,
        name: c.name,
        icon: this.appConfigService.kadServicesInfo(c.name).icon,
        home: this.appConfigService.kadServicesInfo(c.name).home,
        description: this.appConfigService.kadServicesInfo(c.name).description,
      })) as CatalogItem[]) ?? [];

    catalogItems.push(...packages);

    return catalogItems;
  }

  private getCatalogItems(catalogId: string): CatalogItem[] {
    return this.catalogItems.filter(c => c.catalogId === catalogId);
  }

  private toCurrentCatalogCatalog(): void {
    if (!this.currentCatalogId) {
      this.currentCatalogId = this.catalogIds?.[0];
      if (this.currentCatalogId) {
        this.router.navigate([toUri(CATALOG_URI), this.currentCatalogId]);
      }
    }
    this.filtredCatalogItems = this.toCatalogItems(this.catalogs.find(c => c.id === this.currentCatalogId) as Catalog);
  }
}
