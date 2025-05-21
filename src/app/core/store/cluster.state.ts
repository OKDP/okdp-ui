import { Cluster } from '../../api/_model';

export interface ClusterState {
  clusterId: string;
  cluster: Cluster;
  error: any;
}
