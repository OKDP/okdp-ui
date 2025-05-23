import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Catalog, Package } from '../../../../api/_model';
import { OpenApiV3Schema } from '../../../../model';

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

  listById(catalogId: string): Observable<Catalog> {
    return this.http.get<Catalog>(`/catalogs/${catalogId}`);
  }

  getPackage(catalogId: string, name: string): Observable<Package> {
    return this.http.get<Package>(`/catalogs/${catalogId}/packages/${name}`);
  }

  getPackageSchema(catalogId: string, name: string, version: string): Observable<OpenApiV3Schema> {
    return this.http.get<OpenApiV3Schema>(`/catalogs/${catalogId}/packages/${name}/versions/${version}/schema`);
  }

}
