import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OKDPServices } from '../../../common/okdp-services/services/okdp-services.service';
import { UserProfileComponent } from '../../../common/user-profile';
import { RightSidebarService, RightSidebarToggle } from '../../../../shared/services';
import { NotificationComponent, NotificationService } from '../../../common/notifications';
import { AboutComponent } from '../../../common/about/components/about.component';
import { KadInstanceComponent } from '../../../common/kad-instances/components/kad-instances.component';
import { AppConfigService } from '../../../config';
import { Notification, NotificationType } from '../../../models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    UserProfileComponent,
    NotificationComponent,
    KadInstanceComponent,
    AboutComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [],
})
export class NavbarComponent implements OnInit {
  swaggerUrl: string = '';
  notifications: Notification[] = [];

  constructor(
    private okdpServices: OKDPServices,
    private rightSidebarService: RightSidebarService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.swaggerUrl = this.appConfigService.getConfig().okdpApi.swaggerUrl;
    this.notificationService.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  get errorCount(): number {
    return this.notifications.filter(notification => notification.type === NotificationType.Error).length;
  }

  get warningCount(): number {
    return 0;
  }

  get successCount(): number {
    return this.notifications.filter(notification => notification.type === NotificationType.Success).length;
  }

  get infoCount(): number {
    return this.notifications.filter(notification => notification.type === NotificationType.Info).length;
  }

  toggleUserProfile() {
    this.rightSidebarService.toggle(RightSidebarToggle.USER_PROFILE);
  }

  toggleNotifications() {
    this.rightSidebarService.toggle(RightSidebarToggle.NOTIFICATION);
  }

  toggleAbout() {
    this.rightSidebarService.toggle(RightSidebarToggle.ABOUT);
  }
}
