import { AuthConfig } from 'angular-oauth2-oidc';

export interface AppConfig {
  auth: Auth;
  okdpApi: OkdpApi;
  kadServicesInfo: Map<string, KadServicesInfo>;
  kadCatalogsInfo: Map<string, KadCatalogsInfo>;
}

export interface Auth {
  provider: string;
  oauth2Config: AuthConfig;
}

export interface OkdpApi {
  apiUrl: string;
  swaggerUrl: string;
}

export interface KadServicesInfo {
  icon?: string;
  menuIcon?: string;
  description?: string;
  home?: string;
}

export interface KadCatalogsInfo {
  menuIcon?: string;
}
