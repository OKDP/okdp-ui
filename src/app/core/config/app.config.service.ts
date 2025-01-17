import { Injectable } from '@angular/core';
import { AppConfig, KadServicesInfo } from './app.config';
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

  kadServicesInfo(item: string): KadServicesInfo {
    let itemsInfo = this.getConfig().kadServicesInfo;
    for (const key of Object.keys(itemsInfo)) {
      if (item.toLowerCase().includes(key.toLowerCase())) {
        return itemsInfo[key];
      }
    }
    return itemsInfo['default'];
  }

  kadCatalogsInfo(item: string): KadServicesInfo {
    let itemsInfo = this.getConfig().kadCatalogsInfo;
    for (const key of Object.keys(itemsInfo)) {
      if (item.toLowerCase().includes(key.toLowerCase())) {
        return itemsInfo[key];
      }
    }
    return itemsInfo['default'];
  }
}
