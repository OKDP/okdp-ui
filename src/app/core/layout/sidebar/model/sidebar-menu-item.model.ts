export interface SidebarMenuItem {
  name: string;
  icon: string;
  badge?: SidebarMenuBadge;
}

export interface SidebarMenuBadge {
  text: string;
  class: string;
}
