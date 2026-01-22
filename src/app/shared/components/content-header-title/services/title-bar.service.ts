/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

  setTitle(menu: string, title: string, icon: string, description: string) {
    const currentSidebarMenuItem = { title, icon, description };
    sessionStorage.setItem(menu, JSON.stringify(currentSidebarMenuItem));
  }

  getTitle(menu: string): { title: string; icon: string; description: string } {
    return JSON.parse(sessionStorage.getItem(menu) || '{}');
  }
}
