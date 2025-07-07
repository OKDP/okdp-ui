import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { selectCluster, loadClusterSuccess, loadClusterFailure } from '../actions/cluster.action';
import { ClusterService } from '../services/cluster.service';

@Injectable()
export class ClusterEffects {
  constructor(
    private actions$: Actions,
    private clusterService: ClusterService
  ) {}

  loadCluster$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCluster),
      mergeMap(action =>
        this.clusterService.get(action.clusterId).pipe(
          map(cluster => loadClusterSuccess({ cluster })),
          catchError(error =>
            of(
              loadClusterFailure({
                error: `Failed to load cluster: ${error.message}`,
              })
            )
          )
        )
      )
    )
  );
}
