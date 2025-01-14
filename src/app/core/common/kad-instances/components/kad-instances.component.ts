import { Component, OnInit, DestroyRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { KadInstanceService } from '../../../common/kad-instances';
import { AppState } from '../../../store';
import { loadKadInstanceFailure, selectKadInstance } from '../actions/kad-instances.action';
import { DropdownItem, DropdownWithFilterComponent } from '../../../../shared/components/dropdown-with-filter';

@Component({
  selector: 'app-kad-instances',
  standalone: true,
  imports: [MatIconModule, DropdownWithFilterComponent],
  templateUrl: './kad-instances.component.html',
  styleUrls: ['./kad-instances.component.scss'],
  animations: [],
})
export class KadInstanceComponent implements OnInit {
  public kadInstances: DropdownItem[] = [];

  constructor(
    private kadInstanceService: KadInstanceService,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.kadInstanceService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: kadInstances => {
          if (kadInstances.length > 0) {
            this.kadInstances = kadInstances.map(i => ({ key: i.id, value: i.name }) as DropdownItem);
            this.store.dispatch(selectKadInstance({ kadInstanceId: kadInstances[0].id }));
          }
        },
        error: error => {
          this.store.dispatch(
            loadKadInstanceFailure({
              error: `Failed to load kad instance: ${error.message}`,
            })
          );
        },
      });
  }

  onItemSelected(item: DropdownItem) {
    this.store.dispatch(selectKadInstance({ kadInstanceId: item.key }));
  }
}
