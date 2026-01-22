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
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SseClient } from 'ngx-sse-client';
import { AuthService } from '../../../../core/auth';
import { AppConfigService } from '../../../../core/config';

@Injectable({
  providedIn: 'root',
})
export class LogStreamingService {
  constructor(
    private authService: AuthService,
    private config: AppConfigService,
    private sseClient: SseClient,
    private http: HttpClient
  ) {}

  streamLogs(logUrl: string): Observable<string> {
    const token = this.authService.getAccessToken();
    const apiUrl = `${this.config.getConfig().okdpApi.apiUrl}${logUrl}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'text/event-stream');

    const stream$ = this.sseClient
      .stream(apiUrl, { keepAlive: true, reconnectionDelay: 3000, responseType: 'event' }, { headers })
      .pipe(
        switchMap(event => {
          if (event.type === 'error') {
            return of();
          }
          return of((event as MessageEvent).data);
        })
      );

    return stream$;
  }

  /**
   * Downloads logs directly from the backend with authentication
   */
  downloadLogs(downloadUrl: string): Observable<Blob> {
    const token = this.authService.getAccessToken();
    const apiUrl = new URL(`${this.config.getConfig().okdpApi.apiUrl}${downloadUrl}`);

    apiUrl.searchParams.set('download', 'true');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(apiUrl.toString(), {
      headers,
      responseType: 'blob',
    });
  }
}
