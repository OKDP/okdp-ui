import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  activeMenu = '';

  constructor() {}

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }

  getActiveMenu(): string {
    return this.activeMenu;
  }
}
