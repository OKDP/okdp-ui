import { createAction, props } from '@ngrx/store';
import { KadInstance } from '../../../../api/_model';

export const selectKadInstance = createAction('[KAD] Select Kad instanceId', props<{ kadInstanceId: string }>());
export const loadKadInstanceSuccess = createAction(
  '[KAD] Load Kad instance Success',
  props<{ kadInstance: KadInstance }>()
);
export const loadKadInstanceFailure = createAction('[Cluster] Load Cluster Error', props<{ error: string }>());
