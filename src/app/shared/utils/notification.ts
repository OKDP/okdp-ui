import { NotificationType } from '../../core/models';

/**
 * Returns the corresponding Bootstrap text class and Material icon name
 * for a given notification type.
 *
 * @param type - The notification type (Success, Error, Info, or Warning).
 * @returns An object containing:
 *   - msg: The Bootstrap text color class for the notification.
 *   - icon: The Material symbol icon name for the notification.
 *
 * @example
 *   const props = getClass(NotificationType.Success);
 *   // props: { msg: 'text-success', icon: 'check_circle' }
 */
export function getClass(type: NotificationType): { msg: string; icon: string } {
  switch (type) {
    case NotificationType.Success:
      return { msg: 'text-success', icon: 'check_circle' };
    case NotificationType.Error:
      return { msg: 'text-danger', icon: 'error' };
    case NotificationType.Info:
      return { msg: 'text-info', icon: 'info' };
    case NotificationType.Warning:
      return { msg: 'text-warning', icon: 'warning' };
    default:
      return { msg: 'text-warning', icon: 'warning' };
  }
}
