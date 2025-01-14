import { createAction, props } from '@ngrx/store';
import { UserInfo } from '../../../models';

export const login = createAction('[OAuth2] Login');
export const loginSuccess = createAction('[OAuth2] Login Success');
export const userProfile = createAction('[OAuth2] User Profile', props<{ userInfo: UserInfo }>());
export const loginFailure = createAction('[OAuth2] Login Failure', props<{ error: any }>());
export const logout = createAction('[OAuth2] logout');
