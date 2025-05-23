import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, Package, ServerResponse } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class GitReleaseService {
  constructor(private readonly http: HttpClient) {}

  post(clusterId: string, namespace: string, gitkustomizations: string, data: Release): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`/clusters/${clusterId}/namespaces/${namespace}/gitkustomizations/${gitkustomizations}/releases`, data);
  }
}

