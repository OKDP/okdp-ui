import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppConfigService } from '../config';

export const okdpApiClientInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService).getConfig();
  const isOkdpApi = !req.url.startsWith('http://') && !req.url.startsWith('https://');
  if (isOkdpApi) {
    req = req.clone({
      url: `${config.okdpApi.apiUrl}${req.url}`,
    });
  }
  return next(req);
};
