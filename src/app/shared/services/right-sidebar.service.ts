import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RightSidebarToggle, RightSidebarEvent } from './right-sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class RightSidebarService {
  private toggleSideBar = new BehaviorSubject<RightSidebarEvent>({} as RightSidebarEvent);
  readonly toggleSideBar$: Observable<RightSidebarEvent>;

  constructor() {
    this.toggleSideBar$ = this.toggleSideBar.asObservable();
  }

  toggle(name: RightSidebarToggle) {
    this.toggleSideBar.next({
      name: name,
      isToggle: !this.toggleSideBar.getValue().isToggle,
    });
  }
}
