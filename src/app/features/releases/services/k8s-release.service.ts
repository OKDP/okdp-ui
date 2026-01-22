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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, ServerResponse } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class K8sReleaseService {
  constructor(private readonly http: HttpClient) {}

  get(clusterId: string, namespace: string, releaseName: string): Observable<Release> {
    return this.http.get<Release>(`/clusters/${clusterId}/namespaces/${namespace}/releases/${releaseName}`);
  }

  post(clusterId: string, namespace: string, data: Release, dryRun: boolean = false): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(
      `/clusters/${clusterId}/namespaces/${namespace}/releases${dryRun ? '?dryRun=true' : ''}`,
      data
    );
  }

  delete(clusterId: string, namespace: string, releaseName: string): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`/clusters/${clusterId}/namespaces/${namespace}/releases/${releaseName}`);
  }

  put(clusterId: string, namespace: string, data: Release): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`/clusters/${clusterId}/namespaces/${namespace}/releases`, data);
  }
}
