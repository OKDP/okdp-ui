import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CatalogService } from '../../../../core/common/catalogs';
import { Catalog } from '../../../../api/_model';
import { AppConfigService } from '../../../../core/config';
import { LoadingComponent } from '../../../../shared/components/loading';
import { NotificationService } from '../../../../core/common/notifications';
import { errorMessage } from '../../../../core/models';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { CatalogItem } from '../../../../model';

@Component({
  selector: 'app-package-select',
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
    KebabMenuComponent,
    LoadingComponent,
  ],
  templateUrl: './package-select.component.html',
  styleUrls: ['./package-select.component.scss'],
  animations: [],
})
export class PackageSelectComponent implements OnInit {
  @Input() onNext!: () => void;

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterKadCatalogs = this.appConfigService.catalogs().kad;

    this.currentCatalogId = this.route.snapshot.paramMap.get('catalog') as string;

    this.loadCatalogs();
  }

  loadCatalogs(): void {
    this.catalogService.catalogs$.subscribe({
      next: (catalogs: Catalog[]) => {
        this.catalogs = catalogs
          .filter(c => this.filterKadCatalogs.includes(c.id) || this.filterKadCatalogs.includes('all'))
          .sort((e1, e2) => e1.id.toLowerCase().localeCompare(e2.id.toLowerCase()));
        this.catalogIds = this.catalogs.map(c => c.id);
        this.catalogItems = this.catalogs.flatMap(c => this.toCatalogItems(c));
        this.isLoaded = true;
        this.toCurrentCatalogCatalog();
      },
      error: error => {
        this.notificationService.onError('catalog', `Unable to fetch catalog, ${errorMessage(error)}`);
      },
    });
  }

  onSelectService(item: CatalogItem): void {
    this.router.navigate([`/services/${item.name}/create`], {
      queryParams: { catalog: item.catalogId },
    });

    if (this.onNext) {
      this.onNext();
    }
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

  private toCurrentCatalogCatalog(): void {
    this.filtredCatalogItems = this.toCatalogItems(this.catalogs.find(c => c.id === this.currentCatalogId) as Catalog);
  }
}
