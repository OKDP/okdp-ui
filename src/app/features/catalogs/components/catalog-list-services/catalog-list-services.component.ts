import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchFilterComponent } from '../../../../shared/components/search-filter';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs';
import { CatalogService } from '../../../../core/common/catalogs';
import { Catalog } from '../../../../api/_model';
import { AppState } from '../../../../core/store';
import { getKadInstanceId } from '../../../../core/common/kad-instances';
import { CATALOG_URI, OKDP_CATALOG_NAME } from '../../../../core/constants';
import { toUri } from '../../../../shared/utils';
import { CatalogItem, CatalogItemType } from '../../models/catalog-item.model';
import { AppConfigService } from '../../../../core/config';
import { LoadingComponent } from '../../../../shared/components/loading';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { SidebarService } from '../../../../core/layout/sidebar';
import { NotificationService } from '../../../../core/common/notifications';
import { errorMessage } from '../../../../core/models';

@Component({
  selector: 'app-catalog-list-services',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    RouterLink,
    RouterLinkActive,
    SearchFilterComponent,
    NavTabsComponent,
    NgScrollbarModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './catalog-list-services.component.html',
  styleUrls: ['./catalog-list-services.component.scss'],
  animations: [],
})
export class CatalogListServicesComponent implements OnInit {
  catalogNames: string[] = [];
  navTabDisplayClass = '';

  TEMPLATE = CatalogItemType.TEMPLATE;
  catalogs: Catalog[] = [];
  isLoaded = false;

  catalogItems: CatalogItem[] = [];
  filtredCatalogItems: CatalogItem[] = [];

  currentCatalog = '';

  search = '';

  isShowSystemCatalog = false;

  constructor(
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  onDeployService(item: CatalogItem): void {
    this.router.navigate([`/services/${item.name}/deploy`], {
      queryParams: { catalog: item.catalogName },
    });
  }

  onSearchChanged(search: string): void {
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

  ngOnInit(): void {
    this.titleBarService.setCurrentMenu('catalogs');
    this.sidebarService.setActiveMenu('catalogs');

    this.store.pipe(select(getKadInstanceId), takeUntilDestroyed(this.destroyRef)).subscribe(kadInstanceId => {
      if (kadInstanceId) {
        this.isLoaded = false;
        this.getCatalogs(kadInstanceId);
      }
    });

    this.route.paramMap.subscribe(params => {
      this.currentCatalog = params.get('catalog') || '';
      console.log('this.currentCatalog', this.currentCatalog);
    });
  }

  getCatalogs(kadInstanceId: string): void {
    this.catalogService.catalogs$.subscribe({
      next: (catalogs: Catalog[]) => {
        this.catalogs = catalogs.sort((e1, e2) => {
          if (e1.name.toLowerCase() === OKDP_CATALOG_NAME) return -1;
          if (e2.name.toLowerCase() === OKDP_CATALOG_NAME) return 1;
          return e1.name.toLowerCase().localeCompare(e2.name.toLowerCase());
        });
        this.catalogNames = this.catalogs.map(c => c.name);
        this.catalogItems = this.catalogs.flatMap(c => this.toCatalogItems(c));
        this.isLoaded = true;
        this.toCurrentCatalogCatalog();
      },
      error: error => {
        this.notificationService.onError(kadInstanceId, `Unable to fetch catalog, ${errorMessage(error)}`);
      },
    });
  }

  onCatalogChange(catalog: string): void {
    this.filtredCatalogItems = this.getCatalogItems(catalog);
  }

  highlightMatch(item: string | undefined): string | undefined {
    if (!this.search) return item;
    const query = this.search;
    const regex = new RegExp(`(${query})`, 'gi');
    return item?.replace(regex, '<mark class="text-okdp text-nowrap">$1</mark>');
  }

  private toCatalogItems(catalog: Catalog): CatalogItem[] {
    let catalogItems: CatalogItem[] = [];

    let components =
      (catalog?.components.map(c => ({
        catalogName: catalog?.name,
        name: c,
        type: CatalogItemType.COMPONENT,
        icon: this.appConfigService.kadServicesInfo(c).icon,
        description: this.appConfigService.kadServicesInfo(c).description,
      })) as CatalogItem[]) ?? [];

    let templates =
      (catalog?.templates.map(t => ({
        catalogName: catalog?.name,
        name: t,
        type: CatalogItemType.TEMPLATE,
        icon: this.appConfigService.kadServicesInfo(t).icon,
        description: this.appConfigService.kadServicesInfo(t).description,
      })) as CatalogItem[]) ?? [];

    catalogItems.push(...components, ...templates);

    return catalogItems;
  }

  private getCatalogItems(catalog: string): CatalogItem[] {
    return this.catalogItems.filter(c => c.catalogName === catalog);
  }

  private toCurrentCatalogCatalog(): void {
    if (!this.currentCatalog) {
      this.currentCatalog = this.catalogNames[0];
      this.router.navigate([toUri(CATALOG_URI), this.currentCatalog]);
    }
    this.filtredCatalogItems = this.toCatalogItems(this.catalogs.find(c => c.name === this.currentCatalog) as Catalog);
  }
}
