import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { K8sEvent } from '../../../model';

@Injectable({
  providedIn: 'root',
})
export class ReleaseEventsService {
  constructor(private readonly http: HttpClient) {}

  list(clusterId: string, namespace: string, releaseName: string): Observable<K8sEvent[]> {
    return this.http.get<K8sEvent[]>(`/clusters/${clusterId}/namespaces/${namespace}/releases/${releaseName}/events`);
  }
}
