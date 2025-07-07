import { Release } from '../api/_model';

export interface ReleaseInstance extends Release {
  icon: string;
  description: string;
  endpoint: string;
  statusText: string;
  statusIcon: string;
  statusLabel: string;
}
