import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleBarService {
  private pageContentTitle = new BehaviorSubject<string>('home');
  public pageContentTitle$ = this.pageContentTitle.asObservable();

  TitleBarService() {}

  setCurrentMenu(menu: string) {
    sessionStorage.setItem('current-menu', menu);
    this.pageContentTitle.next(menu);
  }

  setTitle(menu: string, title: string, icon: string) {
    const currentSidebarMenuItem = { title, icon };
    sessionStorage.setItem(menu, JSON.stringify(currentSidebarMenuItem));
  }

  getTitle(menu: string): { title: string; icon: string } {
    return JSON.parse(sessionStorage.getItem(menu) || '{}');
  }
}
