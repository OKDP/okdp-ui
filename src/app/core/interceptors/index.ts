import { oauth2Interceptor, okdpApiClientInterceptor } from './';
export * from './oauth2.interceptor';
export * from './okdp-api-client.interceptor';

export const HTTP_CLIENT_INTERCEPTORS = [oauth2Interceptor, okdpApiClientInterceptor];
