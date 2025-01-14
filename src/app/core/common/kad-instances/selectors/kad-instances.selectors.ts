import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.state';

const selectKadInstanceState = (state: AppState) => state.kad;

export const getKadInstanceId = createSelector(selectKadInstanceState, state => state.kadInstanceId);

export const getKadInstance = createSelector(selectKadInstanceState, state => state.kadInstance);

export const getClusterError = createSelector(selectKadInstanceState, state => state.error);
