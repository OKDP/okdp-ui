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
import { TitleCasePipe } from '@angular/common';
import { AppConfig, DisplayCatalog, KadCatalogInfo, KadServiceInfo } from './app.config';
import { environment } from '../../../environments/environment';
import { deepMerge, fetchConfigFile } from '../../shared/utils';
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  static config: AppConfig;
  constructor() {}

  // NgRx effects uses APP_INITIALIZER and may load before the application configuration
  // c.f. issue: https://github.com/ngrx/platform/issues/931
  static async loadConfig(): Promise<void> {
    const appConfig: AppConfig = await fetchConfigFile(environment.appConfig.filePath);
    const overridesConfig: AppConfig = await fetchConfigFile(environment.appConfig.overridesFilePath);

    AppConfigService.config = await deepMerge(appConfig, overridesConfig);
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

  catalogs(): DisplayCatalog {
    return this.getConfig().catalogs;
  }

  getSubmissionMode(): string {
    const mode = this.getConfig().submission.mode;
    const validModes = ['git', 'kubernetes'] as const;
    if (!validModes.includes(mode as any)) {
      throw new Error(`Invalid submission mode: ${mode}. Valid modes are: ${validModes.join(', ')}`);
    }
    return mode;
  }
}

export class CatalogInfo implements KadCatalogInfo {
  private titleCasePipe = new TitleCasePipe();
  name: string;
  displayName?: string;
  menuIcon?: string;
  description?: string;

  constructor(name: string, kadCatalogsInfo: KadCatalogInfo) {
    this.name = name;
    this.displayName = kadCatalogsInfo.displayName;
    this.menuIcon = kadCatalogsInfo.menuIcon;
    this.description = kadCatalogsInfo.description;
  }

  getDisplayName(): string {
    return this.displayName || this.titleCasePipe.transform(this.name);
  }
}
