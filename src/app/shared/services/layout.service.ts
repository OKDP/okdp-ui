import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private sidebarCollapsed = false;

  constructor() {}

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  isSidebarCollapsed() {
    return this.sidebarCollapsed;
  }
}
