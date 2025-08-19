import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { RightSidebarToggle, RightSidebarService } from '../../../../shared/services';
import { Notification, NotificationType } from '../../../models';
import { NotificationService } from '../services/notification.service';
import { KuboCDReleases } from '../../kubocd-releases';
import { getClusterId } from '../../clusters';
import { AppState } from '../../../store';
import { getProjectName } from '../../projects';
import { SearchFilterComponent } from '../../../../shared/components/search-filter';
import { getClass } from '../../../../shared/utils/notification';
import { TimeAgoPipe } from '../../../../shared/pipes';
import { Catalog } from '../../../../api/_model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, TimeAgoPipe],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [],
})
export class NotificationComponent implements OnInit {
  isToggled = false;

  allNotifications: Notification[] = [];
  filtredItems: Notification[] = [];

  catalogs: Catalog[] = [];

  search = '';

  constructor(
    private notificationService: NotificationService,
    private rightSidebarService: RightSidebarService,
    private kubocdReleases: KuboCDReleases,
    private router: Router,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    combineLatest([this.store.select(getClusterId), this.store.select(getProjectName)])
      .pipe(
        filter(([clusterId, projectName]) => !!clusterId && !!projectName),
        tap(() => {
          this.kubocdReleases.clearAll();
          this.notificationService.clearAll();
        }),
        switchMap(([clusterId, projectName]) => this.kubocdReleases.startPollServicesChange(clusterId, [projectName])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(releases => {
        this.kubocdReleases.updateInstances(releases, true);
      });

    this.rightSidebarService.toggleSideBar$
      .pipe(
        filter(event => event.name === RightSidebarToggle.NOTIFICATION),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => (this.isToggled = event.isToggle));

    this.notificationService.messages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(notifications => {
      this.allNotifications = notifications;
      this.filtredItems = notifications;
    });
  }

  onClose(service: string, project: string) {
    this.notificationService.remove(service, project);
  }

  getClass(type: NotificationType): { msg: string; icon: string } {
    return getClass(type);
  }

  hideSidebar() {
    this.rightSidebarService.toggle(RightSidebarToggle.NOTIFICATION);
  }

  onSearchChanged(search: string): void {
    this.search = (search ?? '').trim().toLowerCase();
    if (!this.search) {
      this.filtredItems = this.allNotifications;
    } else {
      const keywords = this.search
        .toLowerCase()
        .split(' ')
        .filter(k => k);
      this.filtredItems = this.allNotifications.filter(n =>
        keywords.some(
          keyword =>
            n.message.toLowerCase().includes(keyword) ||
            n.type.toLowerCase().includes(keyword) ||
            n.service.toLowerCase().includes(keyword)
        )
      );
    }
  }

  onClick(notification: Notification): void {
    this.router.navigate([`/services/${notification.catalogId}/instances/${notification.service}/summary`]);
  }

  get notifications() {
    return [...this.filtredItems].sort((a, b) => b.creationTimestamp.localeCompare(a.creationTimestamp));
  }

  onClear() {
    this.notificationService.clear(this.filtredItems);
  }
}
