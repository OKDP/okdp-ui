import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfileComponent } from '../../../common/user-profile';
import { LayoutService, RightSidebarService, RightSidebarToggle } from '../../../../shared/services';
import { NotificationComponent, NotificationService } from '../../../common/notifications';
import { AboutComponent } from '../../../common/about/components/about.component';
import { ClusterComponent } from '../../../common/clusters/components/cluster.component';
import { AppConfigService } from '../../../config';
import { Notification, NotificationType } from '../../../models';
import { SearchFilterComponent, SearchFilterService } from '../../../../shared/components/search-filter';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    UserProfileComponent,
    NotificationComponent,
    ClusterComponent,
    SearchFilterComponent,
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
  filtredItems: string[] = [];

  constructor(
    private rightSidebarService: RightSidebarService,
    private notificationService: NotificationService,
    private appConfigService: AppConfigService,
    private layoutService: LayoutService,
    private searchFilterService: SearchFilterService,
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
    return this.notifications.filter(notification => notification.type === NotificationType.Warning).length;
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

  get isSidebarCollapsed() {
    return this.layoutService.isSidebarCollapsed();
  }

  onSearchChanged(search: string): void {
    this.searchFilterService.searchChanged(search);
  }
}
