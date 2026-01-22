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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ServerResponse } from '../../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  get(clusterId: string, projectName: string): Observable<Project> {
    return this.http.get<Project>(`/clusters/${clusterId}/projects/${projectName}`);
  }

  listProjects(clusterId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`/clusters/${clusterId}/projects`);
  }

  post(clusterId: string, data: Project): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`/clusters/${clusterId}/projects`, data);
  }

  put(clusterId: string, data: Project): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`/clusters/${clusterId}/projects`, data);
  }

  delete(clusterId: string, projectName: string): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`/clusters/${clusterId}/projects/${projectName}`);
  }
}
