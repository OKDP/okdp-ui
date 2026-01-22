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
