import { KadInstance } from '../../api/_model';

export interface KadInstanceState {
  kadInstanceId: string;
  kadInstance: KadInstance;
  error: any;
}
