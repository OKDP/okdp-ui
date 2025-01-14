import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Service } from '../../../../api/_model';

@Injectable({
  providedIn: 'root',
})
export class OKDPServices {
  private services = new BehaviorSubject<Service[]>([]);
  public services$ = this.services.asObservable();

  constructor(private readonly http: HttpClient) {}

  list(kadInstanceId: string): Observable<Service[]> {
    return this.http
      .get<Service[]>(`/kad/${kadInstanceId}/services`)
      .pipe(tap(services => this.services.next(services)));
  }
}
