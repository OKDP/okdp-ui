/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
