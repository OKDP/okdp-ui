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
