import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime } from 'rxjs';
import { AppState } from '../../../store';
import { getKadInstanceId } from '../../../common/kad-instances';
import { SidebarMenuItem } from '../model/sidebar-menu-item.model';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { LoadingComponent } from '../../../../shared/components/loading';
import { TitleCasePipe } from '../../../../shared/pipes';
import { Catalog } from '../../../../api/_model';
import { NotificationService } from '../../../common/notifications';
import { errorMessage } from '../../../models';
import { SidebarService } from '../services/sidebar.service';
import { AppConfigService } from '../../../config';
import { CatalogService } from '../../../common/catalogs';

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
  isLoaded = false;
  isCollapsed = false;

  private hoverSubject = new Subject<boolean>();

  constructor(
    private catalogService: CatalogService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {
    this.hoverSubject.pipe(debounceTime(200)).subscribe((isHovered: boolean) => {
      this.isCollapsed = isHovered;
    });
  }

  onToggle() {
    this.isCollapsed = !this.isCollapsed;
    this.hoverSubject.next(this.isCollapsed);
  }

  ngOnInit(): void {
    this.titleBarService.setTitle('catalogs', 'Service Catalog', 'fa-solid fa-layer-group');
    this.titleBarService.setTitle('home', 'Home', 'fa-solid fa-home');

    this.store.pipe(select(getKadInstanceId), takeUntilDestroyed(this.destroyRef)).subscribe(kadInstanceId => {
      if (kadInstanceId) {
        this.isLoaded = false;
        this.getCatalogs(kadInstanceId);
        this.isLoaded = true;
      }
    });
  }

  getCatalogs(kadInstanceId: string): void {
    this.catalogService
      .list(kadInstanceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (catalogs: Catalog[]) => {
          this.catalogs = catalogs.map(c => this.toMenuCatalog(c.name)).sort((a, b) => a.name.localeCompare(b.name));

          this.catalogs.forEach(c => {
            this.titleBarService.setTitle(
              c.name,
              this.appConfigService.kadCatalogsInfo(c.name).getDisplayName(),
              c.icon
            );
          });
        },
        error: error => {
          this.notificationService.onError(kadInstanceId, `Unable to fetch catalog, ${errorMessage(error)}`);
        },
      });
  }

  toMenuCatalog(catalog: string): SidebarMenuItem {
    return {
      name: catalog,
      displayName: this.appConfigService.kadCatalogsInfo(catalog).getDisplayName(),
      icon: this.appConfigService.kadCatalogsInfo(catalog).menuIcon,
    } as SidebarMenuItem;
  }

  get activeMenu() {
    return this.sidebarService.getActiveMenu();
  }

  onClick(menu: string) {
    this.sidebarService.setActiveMenu(menu);
    this.titleBarService.setCurrentMenu(menu);
  }
}
