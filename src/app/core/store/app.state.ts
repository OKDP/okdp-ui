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

import { Action, ActionReducer } from '@ngrx/store';
import { OAuth2Effects, oauth2Reducer } from '../auth/oauth2';
import { AuthState } from '../../model';
import { ClusterState } from './cluster.state';
import { clusterIdReducer, ClusterEffects } from '../common/clusters';
import { ProjectState } from './project.state';
import { ProjectEffects, projectNameReducer } from '../common/projects';

// The framework 'angular-oauth2-oidc' already save the auth state in a state session
// No need to save it again
// We target to get the profile from the okdp-server to harmonize the authZ
// (flags to hide or show components in function with server profile)
// We let it like for now
export interface AppState {
  auth: AuthState;
  cluster: ClusterState;
  project: ProjectState;
}

export interface AppStore {
  auth: ActionReducer<AuthState, Action>;
  cluster: ActionReducer<ClusterState, Action>;
  project: ActionReducer<ProjectState, Action>;
}

export const APP_STORE: AppStore = {
  auth: oauth2Reducer,
  cluster: clusterIdReducer,
  project: projectNameReducer,
};

export const APP_EFFECTS = [OAuth2Effects, ClusterEffects, ProjectEffects];
