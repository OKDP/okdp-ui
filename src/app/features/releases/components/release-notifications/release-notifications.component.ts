import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs';
import { LoadingComponent } from '../../../../shared/components/loading';
import { Notification, NotificationType } from '../../../../core/models';
import { getClass } from '../../../../shared/utils/notification';
import { ReleaseInstance } from '../../../../model';
import { AbstractReleaseInstanceComponent } from '../../shared/components/release-instance/release-instance.component';

@Component({
  selector: 'app-notifications-log',
  standalone: true,
  imports: [CommonModule, NavTabsComponent, LoadingComponent],
  templateUrl: './release-notifications.component.html',
  styleUrls: ['./release-notifications.component.scss'],
  animations: [],
})
export class ReleaseNotificationsComponent extends AbstractReleaseInstanceComponent implements OnInit {
  notifications: Notification[] = [];

  constructor() {
    super();
  }

  override updateDataSourceForInstance(instance: ReleaseInstance): void {
    this.notificationService.messages$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(notifications =>
          notifications.filter(n => n.service === instance.metadata.name && n.project === instance.metadata.namespace)
        )
      )
      .subscribe(filteredNotifications => {
        this.notifications = filteredNotifications;
      });
  }

  getClass(type: NotificationType): { msg: string; icon: string } {
    return getClass(type);
  }
}
