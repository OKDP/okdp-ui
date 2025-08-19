import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PodInfo } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class PodInfoService {
  constructor(private readonly http: HttpClient) {}

  list(clusterId: string, namespace: string, releaseName: string): Observable<PodInfo[]> {
    return this.http.get<PodInfo[]>(`/clusters/${clusterId}/namespaces/${namespace}/releases/${releaseName}/pods`);
  }
}
