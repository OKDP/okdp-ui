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
