import { createAction, props } from '@ngrx/store';
import { Cluster } from '../../../../api/_model';

export const selectCluster = createAction('[KAD] Select Kad instanceId', props<{ clusterId: string }>());
export const loadClusterSuccess = createAction('[KAD] Load Kad instance Success', props<{ cluster: Cluster }>());
export const loadClusterFailure = createAction('[Cluster] Load Cluster Error', props<{ error: string }>());
