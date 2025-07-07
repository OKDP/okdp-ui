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
