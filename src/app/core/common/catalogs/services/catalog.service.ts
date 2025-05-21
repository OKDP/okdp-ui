import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Catalog } from '../../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private catalogs = new BehaviorSubject<Catalog[]>([]);
  public catalogs$ = this.catalogs.asObservable();

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Catalog[]> {
    return this.http
      .get<Catalog[]>(`/catalogs`)
      .pipe(tap(catalogs => this.catalogs.next(catalogs)));
  }

  get(catalogId: string): Observable<Catalog> {
    return this.http.get<Catalog>(`/catalogs/${catalogId}`);
  }
}
