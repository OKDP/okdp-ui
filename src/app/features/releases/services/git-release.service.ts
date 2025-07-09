import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, ServerResponse } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class GitReleaseService {
  constructor(private readonly http: HttpClient) {}

  get(clusterId: string, namespace: string, kustomizationName: string, releaseName: string): Observable<Release> {
    return this.http.get<Release>(
      `/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${kustomizationName}/releases/${releaseName}`
    );
  }

  post(clusterId: string, namespace: string, kustomizationName: string, data: Release): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(
      `/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${kustomizationName}/releases`,
      data
    );
  }

  delete(
    clusterId: string,
    namespace: string,
    kustomizationName: string,
    releaseName: string
  ): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(
      `/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${kustomizationName}/releases/${releaseName}`
    );
  }

  put(clusterId: string, namespace: string, kustomizationName: string, data: Release): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(
      `/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${kustomizationName}/releases`,
      data
    );
  }
}
