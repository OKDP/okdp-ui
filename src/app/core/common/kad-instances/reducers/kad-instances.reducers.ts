import { createReducer, on } from '@ngrx/store';
import { KadInstance } from '../../../../api/_model';
import { KadInstanceState } from '../../../store/kad-instance.state';
import { selectKadInstance, loadKadInstanceSuccess, loadKadInstanceFailure } from '../actions/kad-instances.action';

export const initialState: KadInstanceState = {
  kadInstanceId: '',
  kadInstance: {} as KadInstance,
  error: {},
};

export const kadInstanceIdReducer = createReducer(
  initialState,
  on(selectKadInstance, (state, { kadInstanceId }) => ({
    ...state,
    error: null,
    kadInstanceId: kadInstanceId,
  })),
  on(loadKadInstanceSuccess, (state, { kadInstance }) => ({
    ...state,
    kadInstance: kadInstance,
  })),
  on(loadKadInstanceFailure, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
