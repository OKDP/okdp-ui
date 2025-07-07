export interface SidebarMenuItem {
  name: string;
  displayName: string;
  icon: string;
  badge?: SidebarMenuBadge;
  description: string;
}

export interface SidebarMenuBadge {
  text: string;
  class: string;
}
