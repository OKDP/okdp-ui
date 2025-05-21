import { createSelector } from '@ngrx/store';
import { AppState } from '../../../store/app.state';

const selectClusterState = (state: AppState) => state.cluster;

export const getClusterId = createSelector(selectClusterState, state => state.clusterId);

export const getCluster = createSelector(selectClusterState, state => state.cluster);

export const getClusterError = createSelector(selectClusterState, state => state.error);
