export interface SidebarMenuItem {
  title: string;
  icon: string;
  badge?: SidebarMenuBadge;
}

export interface SidebarMenuBadge {
  text: string;
  class: string;
}
