import { createReducer, on } from '@ngrx/store';
import { Project } from '../../../../api/_model';
import { ProjectState } from '../../../store/project.state';
import { selectProject, loadProjectSuccess, loadProjectFailure } from '../actions/project.action';

export const initialState: ProjectState = {
  projectName: '',
  project: {} as Project,
  error: {},
};

export const projectNameReducer = createReducer(
  initialState,
  on(selectProject, (state, { projectName }) => ({
    ...state,
    error: null,
    projectName: projectName,
  })),
  on(loadProjectSuccess, (state, { project }) => ({
    ...state,
    project: project,
  })),
  on(loadProjectFailure, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
