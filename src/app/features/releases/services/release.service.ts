import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, Package } from '../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  constructor(private readonly http: HttpClient) {}

  get(catalogId: string, packageName: string): Observable<Package[]> {
    return this.http.get<Package[]>(`/catalogs/${catalogId}/packages/${packageName}`);
  }

  put(clusterId: string, namespace: string, name: string, data: Release): Observable<Release[]> {
    return this.http.put<Release[]>(`/clusters/${clusterId}/namespaces/${namespace}/releases/${name}`, data);
  }
}


