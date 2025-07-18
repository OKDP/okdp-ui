// app.module.ts or store module
import { MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({
    keys: ['cluster', 'project'],
    storage: localStorage,
    rehydrate: true,
  })(reducer);
}

export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];
