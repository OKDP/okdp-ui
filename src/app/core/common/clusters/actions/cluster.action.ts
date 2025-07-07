import { createAction, props } from '@ngrx/store';
import { Cluster } from '../../../../api/_model';

export const selectCluster = createAction('[Cluster] Select Cluster', props<{ clusterId: string }>());
export const loadClusterSuccess = createAction('[Cluster] Load Clustere Success', props<{ cluster: Cluster }>());
export const loadClusterFailure = createAction('[Cluster] Load Cluster Error', props<{ error: string }>());
