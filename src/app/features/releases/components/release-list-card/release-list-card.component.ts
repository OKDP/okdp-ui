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
import { MatTooltipModule } from '@angular/material/tooltip';
import { EndpointsFromUsagePipe, TitleCasePipe } from '../../../../shared/pipes';
import { LoadingComponent } from '../../../../shared/components/loading';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { ReleaseInstance } from '../../../../model';
import { ContentToolbarComponent } from '../../../../shared/components/content-toolbar';
import { AbstractReleaseBaseComponent } from '../../shared';
import { DialogComponent } from '../../../../shared/components/dialog';
import { extractPackage } from '../../../../shared/utils';

@Component({
  selector: 'app-release-list-card',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    LoadingComponent,
    KebabMenuComponent,
    ContentToolbarComponent,
    TitleCasePipe,
    DialogComponent,
  ],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-list-card.component.html',
  styleUrls: ['./release-list-card.component.scss'],
  animations: [],
})
export class ReleaseListCardComponent extends AbstractReleaseBaseComponent implements OnInit {
  constructor() {
    super();
  }

  highlightMatch(item: string | undefined): string | undefined {
    if (!this.search) return item;
    const query = this.search;
    const regex = new RegExp(`(${query})`, 'gi');
    return item?.replace(regex, '<mark class="text-okdp text-nowrap">$1</mark>');
  }

  override updateDataSource(instances: ReleaseInstance[]): void {}

  onDelete(instance: ReleaseInstance) {
    super.onDeleteRelease(instance.metadata.name!);
  }

  onEdit(instance: ReleaseInstance) {
    super.edit(extractPackage(instance.spec.package.repository), instance.metadata.name!);
  }

  onFavorite(row: ReleaseInstance) {}

  onShowDetails(instance: ReleaseInstance) {
    super.showDetails(instance.metadata.name!);
  }
}
