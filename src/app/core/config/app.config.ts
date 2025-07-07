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
