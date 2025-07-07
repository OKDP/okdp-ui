import { Project } from '../../api/_model';

export interface ProjectState {
  projectName: string;
  project: Project;
  error: any;
}
