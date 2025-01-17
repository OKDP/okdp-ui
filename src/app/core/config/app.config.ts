import { AuthConfig } from 'angular-oauth2-oidc';

export interface AppConfig {
  auth: Auth;
  okdpApi: OkdpApi;
  kadServicesInfo: Map<string, KadServiceInfo>;
  kadCatalogsInfo: Map<string, KadCatalogInfo>;
}

export interface Auth {
  provider: string;
  oauth2Config: AuthConfig;
}

export interface OkdpApi {
  apiUrl: string;
  swaggerUrl: string;
}

export interface KadServiceInfo {
  icon?: string;
  menuIcon?: string;
  description?: string;
  home?: string;
}

export interface KadCatalogInfo {
  displayName?: string;
  menuIcon?: string;
  getDisplayName(name: string): string;
}
