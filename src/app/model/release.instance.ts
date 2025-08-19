import { Release } from '../api/_model';
import { pickFields } from '../shared/utils';

export interface ReleaseInstance extends Release {
  icon: string;
  description: string;
  endpoint: string;
  statusText: string;
  statusIcon: string;
  statusLabel: string;
}

export const ReleaseKeys = ['apiVersion', 'kind', 'metadata', 'spec', 'status'];

export function toRelease(instance?: ReleaseInstance): Release | undefined {
  if (!instance) return undefined;
  return pickFields(instance, ReleaseKeys) as Release;
}
