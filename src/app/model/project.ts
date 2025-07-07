import { Project } from '../api/_model';

export type ProjectView = Project & {
  statusLabel: string;
  statusIcon: string;
};
