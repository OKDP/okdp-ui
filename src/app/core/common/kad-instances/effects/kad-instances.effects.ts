import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { selectKadInstance, loadKadInstanceSuccess, loadKadInstanceFailure } from '../actions/kad-instances.action';
import { KadInstanceService } from '../services/kad-instance.service';

@Injectable()
export class KadInstanceEffects {
  constructor(
    private actions$: Actions,
    private kadInstanceService: KadInstanceService
  ) {}

  loadKadInstance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectKadInstance),
      mergeMap(action =>
        this.kadInstanceService.get(action.kadInstanceId).pipe(
          map(kadInstance => loadKadInstanceSuccess({ kadInstance })),
          catchError(error =>
            of(
              loadKadInstanceFailure({
                error: `Failed to load Kad <instance: ${error.message}`,
              })
            )
          )
        )
      )
    )
  );
}
