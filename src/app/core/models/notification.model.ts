export enum NotificationType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

export interface Notification {
  type: NotificationType;
  service: string;
  project: string;
  catalogId: string;
  message: string;
  creationTimestamp: string;
}
