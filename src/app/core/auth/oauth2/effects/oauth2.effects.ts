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
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, from } from 'rxjs';
import { OAuthErrorEvent, OAuthEvent, OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { login, loginFailure, loginSuccess, userProfile, logout } from '..';
import { AppConfigService } from '../../../../core/config';
import { userInfoConverter } from '../../../models';
import { ERROR_PAGE_URI, HOME_PAGE_URI } from '../../../constants';

@Injectable()
export class OAuth2Effects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private appConfigService: AppConfigService,
    private oAuthService: OAuthService
  ) {
    let auth = this.appConfigService.getConfig()?.auth;
    let authConfig = auth[auth.provider];
    console.log('Successfully loaded auth configuration: ', authConfig);
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  listenOAuth$ = createEffect(() =>
    this.oAuthService.events.pipe(
      mergeMap((event: OAuthEvent) => {
        if (event instanceof OAuthErrorEvent) {
          return [loginFailure({ error: event.reason })];
        }
        if (event instanceof OAuthSuccessEvent && event.type === 'token_received') {
          this.oAuthService.loadUserProfile().then(_ => {});
          return [
            userProfile({
              userInfo: userInfoConverter.fromRecord(this.oAuthService.getIdentityClaims()),
            }),
          ];
        }
        return EMPTY;
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(() => {
        if (this.oAuthService.hasValidIdToken() && this.oAuthService.hasValidAccessToken()) {
          return [loginSuccess()];
        }
        return from(this.oAuthService.loadDiscoveryDocumentAndLogin()).pipe(
          tap((result: boolean): void => {
            if (!result) {
              this.oAuthService.initCodeFlow();
            }
          }),
          mergeMap(() => EMPTY),
          catchError(error => [loginFailure(error)])
        );
      })
    )
  );

  userProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userProfile),
      mergeMap(() => [loginSuccess()])
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => this.router.navigateByUrl(HOME_PAGE_URI))
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        tap(() => this.router.navigate([ERROR_PAGE_URI]))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.oAuthService.logOut();
          return this.router.navigateByUrl('/login');
        })
      ),
    { dispatch: false }
  );
}
