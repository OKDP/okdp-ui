import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, ServerResponse } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class K8sReleaseService {
  constructor(private readonly http: HttpClient) {}

  post(clusterId: string, namespace: string, data: Release, dryRun: boolean = false): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(
      `/clusters/${clusterId}/namespaces/${namespace}/releases${dryRun ? '?dryRun=true' : ''}`,
      data
    );
  }

  delete(clusterId: string, namespace: string, releaseName: string): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`/clusters/${clusterId}/namespaces/${namespace}/releases/${releaseName}`);
  }
}
