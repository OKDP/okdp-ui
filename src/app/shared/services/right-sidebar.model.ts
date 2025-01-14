export enum RightSidebarToggle {
  USER_PROFILE = 'user-profile',
  USER_PREFERENCE = 'user-preference',
  NOTIFICATION = 'notifications',
  ABOUT = 'about',
}

export interface RightSidebarEvent {
  name: RightSidebarToggle;
  isToggle: boolean;
}
