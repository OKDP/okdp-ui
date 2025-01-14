import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComponentReleaseRequest, Component as KadComponent } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class KadComponentService {
  constructor(private readonly http: HttpClient) {}

  get(kadInstanceId: string, name: string): Observable<KadComponent[]> {
    return this.http.get<KadComponent[]>(`/kad/${kadInstanceId}/components/${name}`);
  }

  put(kadInstanceId: string, name: string, data: ComponentReleaseRequest): Observable<ComponentReleaseRequest[]> {
    return this.http.put<ComponentReleaseRequest[]>(`/kad/${kadInstanceId}/componentreleases/${name}`, data);
  }
}
