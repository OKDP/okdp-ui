import { Release } from '../api/_model';

export interface ReleaseInstance {
  release: Release;
  icon: string;
  description: string;
  endpoint: string;
}


type ObjectMeta = { name: string, namespace: string };

