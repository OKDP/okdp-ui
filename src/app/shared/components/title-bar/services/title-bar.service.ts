import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleBarService {
  private titleSubject = new BehaviorSubject<string>('home');

  currentTitle = this.titleSubject.asObservable();

  TitleBarService() {}

  setCurrentMenu(menu: string) {
    sessionStorage.setItem('current-menu', menu);
    this.titleSubject.next(menu);
  }

  getCurrentMenu(): string {
    return sessionStorage.getItem('current-menu') || 'home';
  }

  setTitle(menu: string, title: string, icon: string) {
    const currentSidebarMenuItem = { title, icon };
    sessionStorage.setItem(menu, JSON.stringify(currentSidebarMenuItem));
  }

  getTitle(menu: string): { title: string; icon: string } {
    return JSON.parse(sessionStorage.getItem(menu) || '{}');
  }
}
