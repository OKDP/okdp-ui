import { createAction, props } from '@ngrx/store';
import { Project } from '../../../../api/_model';

export const selectProject = createAction('[Project] Select project', props<{ projectName: string }>());
export const loadProjectSuccess = createAction('[Project] Load project Success', props<{ project: Project }>());
export const loadProjectFailure = createAction('[Project] Load project Error', props<{ error: string }>());
