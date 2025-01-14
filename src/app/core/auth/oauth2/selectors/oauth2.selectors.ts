import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.state';

const selectAuthState = (state: AppState) => state.auth;

export const selectUserProfile = createSelector(selectAuthState, state => state.userInfo);
