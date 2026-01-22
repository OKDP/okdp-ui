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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EndpointsFromUsagePipe } from '../../../../shared/pipes';
import { LoadingComponent } from '../../../../shared/components/loading';
import { LogTerminalComponent } from '../../../../shared/components/log-terminal';
import { AbstractReleaseInstanceComponent } from '../../shared/components/release-instance/release-instance.component';

@Component({
  selector: 'app-release-log',
  standalone: true,
  imports: [CommonModule, LoadingComponent, LogTerminalComponent],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-log.component.html',
  styleUrls: ['./release-log.component.scss'],
  animations: [],
})
export class ReleaseLogComponent extends AbstractReleaseInstanceComponent implements OnInit {
  private qpPodName?: string;
  private qpContainerName?: string;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(qp => {
      this.qpPodName = qp.get('pod') ?? undefined;
      this.qpContainerName = qp.get('container') ?? undefined;
    });
  }

  /**
   * Effective pod name to display logs for:
   * - Use query param `pod` if present AND exists in pods list
   * - Otherwise fall back to the first pod (current behavior)
   */
  get selectedPodName(): string | undefined {
    const podFromQP = this.qpPodName && this.pods.find(p => p.name === this.qpPodName)?.name;
    return podFromQP ?? this.pods[0]?.name;
  }

  /**
   * Effective container name to display logs for:
   * - If query param `container` is present AND exists on the selected pod, use it
   * - Otherwise fall back to the first container of the selected pod (current behavior)
   */
  get selectedContainerName(): string | undefined {
    const podName = this.selectedPodName;
    const pod = this.pods.find(p => p.name === podName);
    if (!pod) return undefined;

    const containerFromQP = this.qpContainerName && pod.containers?.find(c => c.name === this.qpContainerName)?.name;

    return containerFromQP ?? pod.containers?.[0]?.name;
  }

  /**
   * Build the log URL from the effective pod/container.
   * Returns empty string when not resolvable (no pods yet, etc.)
   */
  getLogUrl(): string {
    const podName = this.selectedPodName;
    const containerName = this.selectedContainerName;
    if (podName && containerName) {
      return `/clusters/${this.currentClusterId}/namespaces/${this.currentProjectName}/pods/${podName}/containers/${containerName}/logs`;
    }
    return '';
  }
}
