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

import { AuthConfig } from 'angular-oauth2-oidc';

export interface AppConfig {
  auth: Auth;
  okdpApi: OkdpApi;
  submission: Submission;
  kadCatalogsInfo: Map<string, KadCatalogInfo>;
  kadServicesInfo: Map<string, KadServiceInfo>;
  catalogs: DisplayCatalog;
}

export interface Auth {
  provider: string;
  oauth2Config: AuthConfig;
}

export interface OkdpApi {
  apiUrl: string;
  swaggerUrl: string;
}

export interface Submission {
  mode: string;
}

export interface KadServiceInfo {
  icon?: string;
  menuIcon?: string;
  description?: string;
  home?: string;
}

export interface DisplayCatalog {
  services: string[];
  kad: string[];
}

export interface KadCatalogInfo {
  displayName?: string;
  menuIcon?: string;
  description?: string;
  getDisplayName(name: string): string;
}
