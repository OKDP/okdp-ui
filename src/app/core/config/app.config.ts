import { AuthConfig } from 'angular-oauth2-oidc';

export interface AppConfig {
  auth: Auth;
  okdpApi: OkdpApi;
  kadPatchItemsInfo: Map<string, KadPatchItemInfo>;
}

export interface Auth {
  provider: string;
  oauth2Config: AuthConfig;
}

export interface OkdpApi {
  apiUrl: string;
  swaggerUrl: string;
}

export interface KadPatchItemInfo {
  icon?: string;
  menuIcon?: string;
  description?: string;
  home?: string;
}
