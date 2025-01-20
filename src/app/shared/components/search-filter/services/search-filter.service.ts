import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SearchFilterService {
  private globalSearchFilter = new BehaviorSubject<string>('');
  public globalSearchFilter$ = this.globalSearchFilter.asObservable();

  constructor() {}

  searchChanged(search: string): void {
    this.globalSearchFilter.next(search);
  }
}
