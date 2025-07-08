import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, ServerResponse } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class GitReleaseService {
  constructor(private readonly http: HttpClient) {}

  post(clusterId: string, namespace: string, gitkustomization: string, data: Release): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(
      `/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${gitkustomization}/releases`,
      data
    );
  }

  delete(clusterId: string, namespace: string, gitkustomization: string, releaseName: string): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${gitkustomization}/releases/${releaseName}`);
  }

}
