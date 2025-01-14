export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export interface Notification {
  type: NotificationType;
  service: string;
  message: string;
}

export function errorMessage(error: Error): string {
  return error?.message || 'Unknown error occurred';
}
