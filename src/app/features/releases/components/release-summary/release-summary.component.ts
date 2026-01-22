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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, firstValueFrom, Observable, shareReplay } from 'rxjs';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { EndpointsFromUsagePipe, TitleCasePipe } from '../../../../shared/pipes';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs';
import { LoadingComponent } from '../../../../shared/components/loading';
import { OpenApiV3Schema, PodContainer, PodInstance, toRelease } from '../../../../model';
import { LogTerminalComponent } from '../../../../shared/components/log-terminal';
import { YamlEditorComponent } from '../../../../shared/components/yaml-editor';
import { Release } from '../../../../api/_model';
import {
  copyToClipboardYaml,
  downloadYaml,
  errorMessage,
  extractPackage,
  showCopiedTooltip,
} from '../../../../shared/utils';
import { AbstractReleaseInstanceComponent } from '../../shared/components/release-instance/release-instance.component';

@Component({
  selector: 'app-summary-log',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    NavTabsComponent,
    LoadingComponent,
    LogTerminalComponent,
    YamlEditorComponent,
    TitleCasePipe,
  ],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-summary.component.html',
  styleUrls: ['./release-summary.component.scss'],
  animations: [],
})
export class ReleaseSummaryComponent extends AbstractReleaseInstanceComponent implements OnInit {
  copyTooltip = 'Copy to clipboard';
  showReleaseYaml = false;
  showPackageYaml = false;
  private _packageVersion$?: Observable<OpenApiV3Schema>;

  constructor() {
    super();
  }

  onViewEvents() {
    const segments = this.router.url.split('/');
    segments[segments.length - 1] = 'events';
    const targetUrl = segments.join('/');
    this.router.navigateByUrl(targetUrl);
  }

  onViewPodLogs(pod: PodInstance) {
    if (!pod || !pod.containers || pod.containers.length === 0) {
      console.warn('No containers found for pod:', pod?.name);
      return;
    }

    const firstContainer = pod.containers[0];

    const segments = this.router.url.split('/');
    segments[segments.length - 1] = 'logs';
    const targetUrl = segments.join('/');

    this.router.navigate([targetUrl], {
      queryParams: {
        pod: pod.name,
        container: firstContainer.name,
      },
    });
  }

  onViewContainerLogs(pod: PodInstance, container: PodContainer) {
    const segments = this.router.url.split('/');
    segments[segments.length - 1] = 'logs';
    const targetUrl = segments.join('/');

    this.router.navigate([targetUrl], {
      queryParams: {
        pod: pod.name,
        container: container.name,
      },
    });
  }

  onReleaseViewYaml() {
    this.showPackageYaml = false;
    this.showReleaseYaml = !this.showReleaseYaml;
  }

  async onReleaseCopyToClipboard(tip: MatTooltip): Promise<void> {
    if (!this.release) return;

    try {
      await copyToClipboardYaml(this.release);
      showCopiedTooltip(tip, {
        resetText: 'Copy to clipboard',
        duration: 1000,
        updateBinding: text => (this.copyTooltip = text),
      });
    } catch (err) {
      console.error('Failed to copy Release YAML:', err);
    }
  }

  onReleaseDownload(): void {
    if (!this.release) return;
    downloadYaml(this.release, {
      filename: `release-${this.release.metadata?.name ?? 'release'}.yaml`,
    });
  }

  onPackageViewYaml() {
    this.showReleaseYaml = false;
    this.showPackageYaml = !this.showPackageYaml;
  }

  async onPackageCopyToClipboard(tip: MatTooltip): Promise<void> {
    if (!this._packageVersion$) return;

    try {
      const pkgJson = await this._packageVersion$.pipe().toPromise();
      if (!pkgJson) return;

      await copyToClipboardYaml(pkgJson);
      showCopiedTooltip(tip, {
        resetText: 'Copy to clipboard',
        duration: 1000,
        updateBinding: text => (this.copyTooltip = text),
      });
    } catch (err) {
      console.error('Failed to copy Package YAML:', err);
    }
  }

  onPackageDownload(): void {
    if (!this._packageVersion$) return;
    const repo = this.instance?.spec?.package?.repository;
    const tag = this.instance?.spec?.package?.tag;

    if (!repo || !tag) {
      console.warn('Package download skipped: missing repository or tag.', { repo, tag });
      return;
    }

    firstValueFrom(this._packageVersion$)
      .then(pkgJson => {
        if (!pkgJson) return;
        const pkg = extractPackage(repo);
        downloadYaml(pkgJson, { filename: `package-${pkg}-${tag}.yaml` });
      })
      .catch(err => {
        console.error('Failed to download Package YAML:', err);
      });
  }

  get release(): Release | undefined {
    return toRelease(this.instance);
  }

  get package$(): Observable<OpenApiV3Schema> | undefined {
    const catalogId = this.currentCatalog?.id;
    const repo = this.instance?.spec?.package?.repository;
    const tag = this.instance?.spec?.package?.tag;
    const pkg = repo ? extractPackage(repo) : undefined;

    if (!catalogId || !pkg || !tag) return undefined;

    if (!this._packageVersion$) {
      this._packageVersion$ = this.catalogService.getPackageVersion(catalogId, pkg, tag).pipe(
        catchError(err => {
          this.notificationService.onError(pkg, '', '', errorMessage(err));
          return EMPTY;
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }

    return this._packageVersion$;
  }
}
