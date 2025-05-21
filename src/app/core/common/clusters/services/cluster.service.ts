import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cluster } from '../../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class ClusterService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<Cluster[]> {
    return this.http.get<Cluster[]>('/clusters');
  }

  get(clusterId: string): Observable<Cluster> {
    return this.http.get<Cluster>(`/clusters/${clusterId}`);
  }
}
