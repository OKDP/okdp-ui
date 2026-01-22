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
import { AuthState } from '../../../../model';
import { loginSuccess, loginFailure, userProfile } from '..';

import { UserInfo } from '../../../models';

// The framework 'angular-oauth2-oidc' already save the user info in a state session
// No need to save it again
// We target to get the profile from the okdp-server to harmonize the authZ
// (flags to hide or show components in function with server profile)
// We let it like for now
export const initialState: AuthState = {
  userInfo: {} as UserInfo,
  error: {},
};

export const oauth2Reducer = createReducer(
  initialState,
  on(userProfile, (state, { userInfo }) => ({
    ...state,
    userInfo,
  })),
  on(loginSuccess, state => ({
    ...state,
    userInfo: state.userInfo,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
