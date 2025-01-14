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
