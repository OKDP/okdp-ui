import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { selectProject, loadProjectSuccess, loadProjectFailure } from '../actions/project.action';
import { ProjectService } from '../services/project.service';
import { getClusterId } from '../../clusters';
import { AppState } from '../../../store';

@Injectable()
export class ProjectEffects {
  constructor(
    private actions$: Actions,
    private projectService: ProjectService,
    private store: Store<AppState>
  ) {}

  loadProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectProject),
      withLatestFrom(this.store.pipe(select(getClusterId))),
      mergeMap(([action, clusterId]) =>
        this.projectService.get(clusterId, action.projectName).pipe(
          map(project => loadProjectSuccess({ project })),
          catchError(error =>
            of(
              loadProjectFailure({
                error: `Failed to load project: ${error.message}`,
              })
            )
          )
        )
      )
    )
  );
}
