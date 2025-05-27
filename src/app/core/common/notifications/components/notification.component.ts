import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { RightSidebarToggle, RightSidebarService } from '../../../../shared/services';
import { Notification, NotificationType } from '../../../models';
import { NotificationService } from '../services/notification.service';
import { KuboCDReleases } from '../../kubocd-releases';
import { ClusterService, getClusterId } from '../../clusters';
import { AppState } from '../../../store';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [],
})
export class NotificationComponent implements OnInit {
  isToggled = false;

  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private rightSidebarService: RightSidebarService,
    private kubocdReleases: KuboCDReleases,
    private clusterService: ClusterService,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.store
      .pipe(
        select(getClusterId),
        takeUntilDestroyed(this.destroyRef),
        filter((clusterId): clusterId is string => Boolean(clusterId)),
        tap(clusterId => {
          this.kubocdReleases.startPollServicesChange(clusterId, ['default', 'kubocd', 'kubocd-system']); // NS
        })
      )
      .subscribe();

    this.rightSidebarService.toggleSideBar$
      .pipe(
        filter(event => event.name === RightSidebarToggle.NOTIFICATION),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => (this.isToggled = event.isToggle));

    this.notificationService.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  onClose(service: string) {
    this.notificationService.removeMessage(service);
  }

  getClass(type: NotificationType): { msg: string; icon: string } {
    switch (type) {
      case NotificationType.Success:
        return { msg: 'text-success', icon: 'check_circle' };
      case NotificationType.Error:
        return { msg: 'text-danger', icon: 'error' };
      case NotificationType.Info:
        return { msg: 'text-info', icon: 'info' };
      case NotificationType.Warning:
        return { msg: 'text-warning', icon: 'warning' };
      default:
        return { msg: 'text-warning', icon: 'warning' };
    }
  }

  hideSidebar() {
    this.rightSidebarService.toggle(RightSidebarToggle.NOTIFICATION);
  }
}
