import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { AppConfig, KadCatalogInfo, KadServiceInfo } from './app.config';
import { APP_CONFIG_FILE_PATH } from '../constants';
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  static config: AppConfig;
  constructor() {}

  // NgRx effects uses APP_INITIALIZER and may load before the application configuration
  // c.f. issue: https://github.com/ngrx/platform/issues/931
  static async loadConfig(): Promise<void> {
    AppConfigService.config = await fetch(APP_CONFIG_FILE_PATH).then(response => {
      if (!response.ok) {
        throw new Error(
          'Failed to load application configuration from file:' + APP_CONFIG_FILE_PATH + '; details: ' + response
        );
      }
      return response.json();
    });
  }

  getConfig(): AppConfig {
    return AppConfigService.config;
  }

  kadServicesInfo(item: string): KadServiceInfo {
    let itemsInfo = this.getConfig().kadServicesInfo;
    for (const key of Object.keys(itemsInfo)) {
      if (item.toLowerCase().includes(key.toLowerCase())) {
        return itemsInfo[key];
      }
    }
    return itemsInfo['default'];
  }

  kadCatalogsInfo(item: string): CatalogInfo {
    let itemsInfo = this.getConfig().kadCatalogsInfo;
    for (const key of Object.keys(itemsInfo)) {
      if (item.toLowerCase().includes(key.toLowerCase())) {
        return new CatalogInfo(item, itemsInfo[key]);
      }
    }
    return new CatalogInfo(item, itemsInfo['default']);
  }
}

export class CatalogInfo implements KadCatalogInfo {
  private titleCasePipe = new TitleCasePipe();
  name: string;
  displayName?: string;
  menuIcon?: string;

  constructor(name: string, kadCatalogsInfo: KadCatalogInfo) {
    this.name = name;
    this.displayName = kadCatalogsInfo.displayName;
    this.menuIcon = kadCatalogsInfo.menuIcon;
  }

  getDisplayName(): string {
    return this.displayName || this.titleCasePipe.transform(this.name);
  }
}
