export interface SidebarMenuItem {
  name: string;
  displayName: string;
  icon: string;
  badge?: SidebarMenuBadge;
}

export interface SidebarMenuBadge {
  text: string;
  class: string;
}
