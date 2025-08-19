import { PodInfo } from '../api/_model';

export interface PodInstance extends PodInfo {
  statusIcon: string;
  statusLabel: string;
  statusText: string;
  healthIcon: string;
  healthLabel: string;
  healthText: string;
}

export type PodContainer = PodInfo['containers'][number];
