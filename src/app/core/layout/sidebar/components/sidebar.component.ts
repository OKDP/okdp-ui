import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { AppState } from '../../../store';
import { SidebarMenuItem } from '../model/sidebar-menu-item.model';
import { TitleBarService } from '../../../../shared/components/content-header-title';
import { LoadingComponent } from '../../../../shared/components/loading';
import { TitleCasePipe } from '../../../../shared/pipes';
import { Catalog } from '../../../../api/_model';
import { NotificationService } from '../../../common/notifications';
import { errorMessage } from '../../../models';
import { SidebarService } from '../services/sidebar.service';
import { AppConfigService } from '../../../config';
import { CatalogService } from '../../../common/catalogs';
import { LayoutService } from '../../../../shared/services';
import { getProjectName } from '../../../common/projects';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LoadingComponent, TitleCasePipe, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [],
})
export class SidebarComponent implements OnInit {
  menus: SidebarMenuItem[];
  catalogs: SidebarMenuItem[];
  currentProjectName: string = 'default';
  isLoaded = false;

  filterKadCatalogs: string[] = [];
  filterServicesCatalogs: string[] = [];

  constructor(
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private layoutService: LayoutService,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.titleBarService.setTitle('catalogs', 'Catalog', 'fa-solid fa-layer-group', 'Explore and manage your services');
    this.titleBarService.setTitle('home', 'Home', 'fa-solid fa-home', 'Welcome screen with key info and navigation');
    this.titleBarService.setTitle(
      'projects',
      'Projects',
      'fa-solid fa-project-diagram',
      'Create and manage your projects'
    );

    this.filterKadCatalogs = this.appConfigService.catalogs().kad;
    this.filterServicesCatalogs = this.appConfigService.catalogs().services;
    this.isLoaded = false;
    this.getCatalogs();
    this.isLoaded = true;

    this.store.pipe(select(getProjectName), takeUntilDestroyed(this.destroyRef)).subscribe(projectName => {
      if (projectName) {
        this.currentProjectName = projectName;
      }
    });
  }

  getCatalogs(): void {
    this.catalogService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (catalogs: Catalog[]) => {
          this.catalogs = catalogs
            .filter(c => this.filterServicesCatalogs.includes(c.id) || this.filterServicesCatalogs.includes('all'))
            .map(c => this.toMenuCatalog(c.id));

          this.catalogs.forEach(c => {
            this.titleBarService.setTitle(
              c.name,
              this.appConfigService.kadCatalogsInfo(c.name).getDisplayName(),
              c.icon,
              c.description
            );
          });
        },
        error: error => {
          this.notificationService.onError('cluster', `Unable to fetch catalog, ${errorMessage(error)}`);
        },
      });
  }

  toMenuCatalog(catalogId: string): SidebarMenuItem {
    return {
      name: catalogId,
      displayName: this.appConfigService.kadCatalogsInfo(catalogId).getDisplayName(),
      icon: this.appConfigService.kadCatalogsInfo(catalogId).menuIcon,
      description: this.appConfigService.kadCatalogsInfo(catalogId).description,
    } as SidebarMenuItem;
  }

  get activeMenu() {
    return this.sidebarService.getActiveMenu();
  }

  onClick(menu: string) {
    this.sidebarService.setActiveMenu(menu);
    this.titleBarService.setCurrentMenu(menu);
  }

  onToggle() {
    this.layoutService.toggleSidebar();
  }

  get isCollapsed() {
    return this.layoutService.isSidebarCollapsed();
  }
}
