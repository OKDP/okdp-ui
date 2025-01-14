import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged, interval, of, Subject, switchMap, catchError, debounceTime } from 'rxjs';
import { OKDPServices } from '../../../common/okdp-services';
import { AppState } from '../../../store';
import { getKadInstanceId } from '../../../common/kad-instances';
import { SidebarMenuItem } from '../model/sidebar-menu-item.model';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { LoadingComponent } from '../../../../shared/components/loading';
import { TitleCasePipe } from '../../../../shared/pipes';
import { Service } from '../../../../api/_model';
import { OKDP_SERVICES_FETCH_POLLING_INTERVAL_MS } from '../../../constants';
import { NotificationService } from '../../../common/notifications';
import { errorMessage } from '../../../models';
import { SidebarService } from '../services/sidebar.service';
import { AppConfigService } from '../../../config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LoadingComponent, TitleCasePipe, MatIconModule, RouterLink, RouterLinkActive],
  providers: [TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [],
})
export class SidebarComponent implements OnInit {
  instances: Service[] = [];
  menus: SidebarMenuItem[];
  isLoaded = false;
  isCollapsed = true;

  private hoverSubject = new Subject<boolean>();

  constructor(
    private okdpServices: OKDPServices,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private titleCasePipe: TitleCasePipe,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {
    this.hoverSubject.pipe(debounceTime(200)).subscribe((isHovered: boolean) => {
      this.isCollapsed = isHovered;
    });
  }

  onMouseEnter() {
    this.hoverSubject.next(false);
  }

  onMouseLeave() {
    this.hoverSubject.next(true);
  }

  ngOnInit(): void {
    this.titleBarService.setTitle('catalogs', 'Service Catalog', 'fa-solid fa-layer-group');
    this.titleBarService.setTitle('home', 'Home', 'fa-solid fa-home');

    this.store.pipe(select(getKadInstanceId), takeUntilDestroyed(this.destroyRef)).subscribe(kadInstanceId => {
      if (kadInstanceId) {
        this.fetchInstances(kadInstanceId);
        this.pollInstancesChange(kadInstanceId);
      }
    });
  }

  fetchInstances(kadInstanceId: string): void {
    this.isLoaded = false;
    this.getOkdpServices(kadInstanceId);
  }

  getOkdpServices(kadInstanceId: string): void {
    this.okdpServices
      .list(kadInstanceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: services => this.updateInstances(services, false),
        error: error =>
          this.notificationService.onError('Services', `Failed to fetch okdp services, ${errorMessage(error)}`),
      });
  }

  pollInstancesChange(kadInstanceId: string): void {
    interval(OKDP_SERVICES_FETCH_POLLING_INTERVAL_MS)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.okdpServices.list(kadInstanceId)),
        catchError(error => {
          this.notificationService.onError('Services', `Failed to poll okdp services, ${errorMessage(error)}`);
          return of([]);
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(services => {
        this.updateInstances(services, true);
      });
  }

  updateInstances(services: Service[], notify: boolean): void {
    const { updatedInstances, newInstances, deletedInstances } = this.compareInstances(this.instances, services);

    if (notify) {
      if (newInstances.length > 0) {
        newInstances.forEach(s => this.notificationService.onSuccess(s.name, 'was successfully deployed.'));
      }

      if (deletedInstances.length > 0) {
        deletedInstances.forEach(s => this.notificationService.onInfo(s.name, 'was removed !'));
      }
    }

    this.instances = [...updatedInstances];
    this.menus = this.groupInstancesAsServiceMenus(this.instances);

    this.menus.forEach(m => {
      this.titleBarService.setTitle(m.title, this.titleCasePipe.transform(m.title), m.icon);
    });

    this.isLoaded = true;
  }

  compareInstances(
    oldInstances: Service[],
    newInstances: Service[]
  ): {
    updatedInstances: Service[];
    newInstances: Service[];
    deletedInstances: Service[];
  } {
    const updatedInstancesList = [...oldInstances];
    const newInstancesList: Service[] = [];
    const deletedInstancesList: Service[] = [];

    newInstances.forEach(newInstance => {
      const existingMenuIndex = oldInstances.findIndex(oldInstance => oldInstance.name === newInstance.name);

      if (existingMenuIndex === -1) {
        newInstancesList.push(newInstance);
        updatedInstancesList.push(newInstance);
      } else {
        updatedInstancesList[existingMenuIndex] = newInstance;
      }
    });

    oldInstances.forEach(oldInstance => {
      if (!newInstances.some(newInstance => newInstance.name === oldInstance.name)) {
        deletedInstancesList.push(oldInstance);
      }
    });

    return {
      updatedInstances: updatedInstancesList,
      newInstances: newInstancesList,
      deletedInstances: deletedInstancesList,
    };
  }

  /**
   *
   * @param instances Group the service instances as services menus
   * @returns
   */
  groupInstancesAsServiceMenus(instances: Service[]): SidebarMenuItem[] {
    return Array.from(
      new Set(
        instances.flatMap(instance => {
          if (instance.isComposition) {
            return [instance.name];
          } else {
            return instance.flatComponents.map(fc => fc.componentName);
          }
        })
      )
    ).map(
      service =>
        ({
          title: service,
          icon: this.appConfigService.kadPatchItemsInfo(service).menuIcon,
        }) as SidebarMenuItem
    );
  }

  get activeMenu() {
    return this.sidebarService.getActiveMenu();
  }

  onClick(menu: string) {
    this.sidebarService.setActiveMenu(menu);
    this.titleBarService.setCurrentMenu(menu);
  }
}
