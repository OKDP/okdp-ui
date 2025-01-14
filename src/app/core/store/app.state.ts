import { Action, ActionReducer } from '@ngrx/store';
import { OAuth2Effects, oauth2Reducer } from '../auth/oauth2';
import { AuthState } from '../../model';
import { KadInstanceState } from './kad-instance.state';
import { kadInstanceIdReducer, KadInstanceEffects } from '../common/kad-instances';

// The framework 'angular-oauth2-oidc' already save the auth state in a state session
// No need to save it again
// We target to get the profile from the okdp-server to harmonize the authZ
// (flags to hide or show components in function with server profile)
// We let it like for now
export interface AppState {
  auth: AuthState;
  kad: KadInstanceState;
}

export interface AppStore {
  auth: ActionReducer<AuthState, Action>;
  kad: ActionReducer<KadInstanceState, Action>;
}

export const APP_STORE: AppStore = {
  auth: oauth2Reducer,
  kad: kadInstanceIdReducer,
};

export const APP_EFFECTS = [OAuth2Effects, KadInstanceEffects];
