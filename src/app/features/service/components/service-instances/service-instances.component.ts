import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OKDPServices } from '../../../../core/common/okdp-services';
import { Service } from '../../../../api/_model';
import { AppConfigService } from '../../../../core/config';
import { EndpointsFromUsagePipe } from '../../../../shared/pipes';
import { ServiceInstance } from '../../../../model';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { LoadingComponent } from '../../../../shared/components/loading';
import { SidebarService } from '../../../../core/layout/sidebar';
import { AppState } from '../../../../core/store';
import { getKadInstanceId } from '../../../../core/common/kad-instances';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { SearchFilterService } from '../../../../shared/components/search-filter';
import { NotificationService } from '../../../../core/common/notifications';
import { errorMessage } from '../../../../core/models';

@Component({
  selector: 'app-service-instances',
  standalone: true,
  imports: [CommonModule, LoadingComponent, KebabMenuComponent],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './service-instances.component.html',
  styleUrls: ['./service-instances.component.scss'],
  animations: [],
})
export class ServiceInstancesComponent implements OnInit {
  isLoaded = false;

  private services: Service[] = [];
  private catalog: string = '';

  instances: ServiceInstance[] = [];
  filtredInstances: ServiceInstance[] = [];

  search = '';

  constructor(
    private okdpServices: OKDPServices,
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
    this.store.pipe(select(getKadInstanceId), takeUntilDestroyed(this.destroyRef)).subscribe(kadInstanceId => {
      if (kadInstanceId) {
        this.isLoaded = false;
        this.okdpServices.loadOKDPServices(kadInstanceId);
        this.okdpServices.startPollServicesChange(kadInstanceId);
      }
    });

    this.route.paramMap.subscribe(params => {
      this.catalog = params.get('service') || '-';
      this.toInstances();
    });

    this.okdpServices.services$.subscribe(services => {
      this.services = services;
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
    this.titleBarService.setCurrentMenu(this.catalog);
    this.sidebarService.setActiveMenu(this.catalog);
    this.instances = this.services
      .filter(s => s.flatComponents.some(flatComponent => flatComponent.catalogs.includes(this.catalog)))
      .map(
        s =>
          ({
            service: s,
            icon: this.appConfigService.kadServicesInfo(s.name).icon!,
            description: this.appConfigService.kadServicesInfo(s.name).description!,
            endpoint:
              this.endpointsFromUsagePipe.transform(s.flatComponents.find(c => c.usage !== '')?.usage || '')[0] || '',
          }) as ServiceInstance
      )
      .sort((a, b) => a.service.name.localeCompare(b.service.name));
    this.searchChanged(this.search);
  }

  searchChanged(search: string): void {
    this.search = search;
    if (!search) {
      this.filtredInstances = this.instances;
    } else {
      this.filtredInstances = this.instances.filter(
        instance =>
          instance.service.name.toLowerCase().includes(search.toLowerCase()) ||
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
