import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OKDPServices } from '../../../../core/common/okdp-services';
import { Service } from '../../../../api/_model';
import { AppConfigService } from '../../../../core/config';
import { EndpointsFromUsagePipe } from '../../../../shared/pipes';
import { ServiceInstance } from '../../../../model';
import { TitleBarService } from '../../../../shared/components/title-bar';
import { LoadingComponent } from '../../../../shared/components/loading';
import { SidebarService } from '../../../../core/layout/sidebar';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  animations: [],
})
export class ServiceDetailsComponent implements OnInit {
  private services: Service[] = [];
  instances: ServiceInstance[] = [];
  isLoaded = false;

  constructor(
    private okdpServices: OKDPServices,
    private appConfigService: AppConfigService,
    private endpointsFromUsagePipe: EndpointsFromUsagePipe,
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.okdpServices.services$.subscribe(services => {
      this.services = services;
      this.toService();
      this.isLoaded = services.length > 0;
    });
  }

  toService() {
    this.route.paramMap.subscribe(params => {
      const service: string = params.get('service') || '-';
      this.titleBarService.setCurrentMenu(service);
      this.sidebarService.setActiveMenu(service);
      this.instances = this.services
        .filter(
          s => s.flatComponents.some(flatComponent => flatComponent.componentName === service) || s.name === service
        )
        .map(
          s =>
            ({
              service: s,
              icon: this.appConfigService.kadPatchItemsInfo(service).icon!,
              description: this.appConfigService.kadPatchItemsInfo(service).description!,
              endpoint:
                this.endpointsFromUsagePipe.transform(s.flatComponents.find(c => c.usage !== '')?.usage || '')[0] || '',
            }) as ServiceInstance
        );
    });
  }
}
