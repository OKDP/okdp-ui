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
