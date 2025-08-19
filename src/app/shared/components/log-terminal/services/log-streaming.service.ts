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
