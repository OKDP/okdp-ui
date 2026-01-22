/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    return this.http.get<Catalog[]>(`/catalogs`).pipe(tap(catalogs => this.catalogs.next(catalogs)));
  }

  listById(catalogId: string): Observable<Catalog> {
    return this.http.get<Catalog>(`/catalogs/${catalogId}`);
  }

  getPackage(catalogId: string, name: string): Observable<Package> {
    return this.http.get<Package>(`/catalogs/${catalogId}/packages/${name}`);
  }

  getPackageVersion(catalogId: string, name: string, version: string): Observable<OpenApiV3Schema> {
    return this.http.get<OpenApiV3Schema>(`/catalogs/${catalogId}/packages/${name}/versions/${version}`);
  }

  getPackageSchema(catalogId: string, name: string, version: string): Observable<OpenApiV3Schema> {
    return this.http.get<OpenApiV3Schema>(`/catalogs/${catalogId}/packages/${name}/versions/${version}/schema`);
  }
}
