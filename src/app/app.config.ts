import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_ROUTES } from './app.routes';

import { APP_STORE, APP_EFFECTS } from './core/store';
import { HTTP_CLIENT_INTERCEPTORS } from './core/interceptors';
import { metaReducers } from './core/store/app.storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    provideStore(APP_STORE, { metaReducers }),
    provideEffects(APP_EFFECTS),
    provideAnimations(),
    provideHttpClient(withInterceptors(HTTP_CLIENT_INTERCEPTORS)),
    provideOAuthClient(),
    importProvidersFrom(BsDropdownModule.forRoot()),
  ],
};
