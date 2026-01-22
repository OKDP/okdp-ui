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
import { OAuthService } from 'angular-oauth2-oidc';
import { UserInfo, userInfoConverter } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oAuthService: OAuthService) {}

  isAuthenticated(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  getUserInfo(): UserInfo {
    if (this.isAuthenticated()) {
      return userInfoConverter.fromRecord(this.oAuthService.getIdentityClaims());
    }
    return {} as UserInfo;
  }

  getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }
}
