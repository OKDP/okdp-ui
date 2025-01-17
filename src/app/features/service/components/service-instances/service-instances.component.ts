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

@Component({
  selector: 'app-service-instances',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './service-instances.component.html',
  styleUrls: ['./service-instances.component.scss'],
  animations: [],
})
export class ServiceInstancesComponent implements OnInit {
  instances: ServiceInstance[] = [];
  isLoaded = false;

  private services: Service[] = [];
  private catalog: string = '';

  constructor(
    private okdpServices: OKDPServices,
    private appConfigService: AppConfigService,
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
  }
}
