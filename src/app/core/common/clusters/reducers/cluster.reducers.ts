import { createReducer, on } from '@ngrx/store';
import { Cluster } from '../../../../api/_model';
import { ClusterState } from '../../../store/cluster.state';
import { selectCluster, loadClusterSuccess, loadClusterFailure } from '../actions/cluster.action';

export const initialState: ClusterState = {
  clusterId: '',
  cluster: {} as Cluster,
  error: {},
};

export const clusterIdReducer = createReducer(
  initialState,
  on(selectCluster, (state, { clusterId }) => ({
    ...state,
    error: null,
    clusterId: clusterId,
  })),
  on(loadClusterSuccess, (state, { cluster }) => ({
    ...state,
    cluster: cluster,
  })),
  on(loadClusterFailure, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
