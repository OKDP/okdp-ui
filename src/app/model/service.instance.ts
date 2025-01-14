import { Service } from '../api/_model';

export interface ServiceInstance {
  service: Service;
  icon: string;
  description: string;
  endpoint: string;
}
