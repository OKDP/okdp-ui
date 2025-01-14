import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalog } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private readonly http: HttpClient) {}

  list(kadInstanceId: string): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(`/kad/${kadInstanceId}/catalogs`);
  }

  get(kadInstanceId: string): Observable<Catalog> {
    return this.http.get<Catalog>(`/kad/${kadInstanceId}/catalogs/${name}`);
  }
}
