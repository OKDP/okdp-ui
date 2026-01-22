/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
