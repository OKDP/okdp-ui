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

import { Component, OnInit, DestroyRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ClusterService } from '..';
import { AppState } from '../../../store';
import { loadClusterFailure, selectCluster } from '../actions/cluster.action';
import { DropdownItem, DropdownWithFilterComponent } from '../../../../shared/components/dropdown-with-filter';

@Component({
  selector: 'app-clusters',
  standalone: true,
  imports: [MatIconModule, DropdownWithFilterComponent],
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss'],
  animations: [],
})
export class ClusterComponent implements OnInit {
  public clusters: DropdownItem[] = [];

  constructor(
    private clusterService: ClusterService,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.clusterService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: clusters => {
          if (clusters.length > 0) {
            this.clusters = clusters.map(i => ({ key: i.id, value: i.name }) as DropdownItem);
            this.store.dispatch(selectCluster({ clusterId: clusters[0].id }));
          }
        },
        error: error => {
          this.store.dispatch(
            loadClusterFailure({
              error: `Failed to load cluster: ${error.message}`,
            })
          );
        },
      });
  }

  onItemSelected(item: DropdownItem) {
    this.store.dispatch(selectCluster({ clusterId: item.key }));
  }
}
