import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.state';

const selectProjectState = (state: AppState) => state.project;

export const getProjectName = createSelector(selectProjectState, state => state.projectName);

export const getProject = createSelector(selectProjectState, state => state.project);

export const getProjectError = createSelector(selectProjectState, state => state.error);
