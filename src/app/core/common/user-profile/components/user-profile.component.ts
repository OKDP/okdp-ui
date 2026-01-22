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

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService, logout } from '../../../auth';
import { UserInfo } from '../../../models';
import { AppState } from '../../../store';
import { RightSidebarToggle, RightSidebarService } from '../../../../shared/services';
import { ThemeComponent } from '../../../../shared/components/theme/components/theme.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ThemeComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [],
})
export class UserProfileComponent implements OnInit {
  readonly userInfo: UserInfo;
  currentTheme: 'light' | 'dark' = 'light';

  isToggled = false;

  constructor(
    private authService: AuthService,
    private rightSidebarService: RightSidebarService,
    private store: Store<AppState>
  ) {
    this.userInfo = authService.getUserInfo();
  }

  ngOnInit() {
    this.rightSidebarService.toggleSideBar$
      .pipe(filter(event => event.name === RightSidebarToggle.USER_PROFILE))
      .subscribe(event => (this.isToggled = event.isToggle));
  }

  hideSidebar() {
    this.rightSidebarService.toggle(RightSidebarToggle.USER_PROFILE);
  }

  logout() {
    this.store.dispatch(logout());
  }
}
