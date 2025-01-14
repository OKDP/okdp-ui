import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KadInstance } from '../../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class KadInstanceService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<KadInstance[]> {
    return this.http.get<KadInstance[]>('/kad');
  }

  get(kadInstanceId: string): Observable<KadInstance> {
    return this.http.get<KadInstance>(`/kad/${kadInstanceId}`);
  }
}
