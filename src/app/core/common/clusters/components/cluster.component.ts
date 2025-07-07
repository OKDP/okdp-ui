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
