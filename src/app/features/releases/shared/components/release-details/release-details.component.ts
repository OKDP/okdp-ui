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
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EndpointsFromUsagePipe, TitleCasePipe } from '../../../../../shared/pipes';
import { NavTabsComponent } from '../../../../../shared/components/nav-tabs';
import { LoadingComponent } from '../../../../../shared/components/loading';
import { ReleaseInstance } from '../../../../../model';
import { AbstractReleaseInstanceComponent } from '../release-instance/release-instance.component';
import { extractPackage } from '../../../../../shared/utils';
import { DialogComponent } from '../../../../../shared/components/dialog';

@Component({
  selector: 'app-release-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatTooltipModule,
    NavTabsComponent,
    LoadingComponent,
    DialogComponent,
    TitleCasePipe,
  ],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-details.component.html',
  styleUrls: ['./release-details.component.scss'],
  animations: [],
})
export class ReleaseDetailsComponent extends AbstractReleaseInstanceComponent implements OnInit {
  constructor() {
    super();
  }

  onDelete(instance?: ReleaseInstance) {
    const name = instance?.metadata?.name;
    if (!name) {
      console.warn('Delete skipped: missing instance name.', instance);
      return;
    }
    super.onDeleteRelease(name);
  }

  onEdit(instance?: ReleaseInstance) {
    const repo = instance?.spec?.package?.repository;
    const name = instance?.metadata?.name;

    if (!repo || !name) {
      console.warn('Edit skipped: missing repository or name.', { repo, name, instance });
      return;
    }

    const pkg = extractPackage(repo);
    super.edit(pkg, name);
  }

  onFavorite(instance?: ReleaseInstance) {}
}
