import { inject, Injectable, OnInit } from '@angular/core';
import { AbstractReleaseBaseComponent } from '../../../shared';
import { PodInstance, ReleaseInstance, ToStatusView } from '../../../../../model';
import { PodInfoService } from '../../../services/pod-info.service';
import { errorMessage } from '../../../../../shared/utils';

@Injectable()
export abstract class AbstractReleaseInstanceComponent extends AbstractReleaseBaseComponent implements OnInit {
  protected readonly podInfoService = inject(PodInfoService);

  tabs: string[] = ['Summary', 'Notifications', 'Events', 'Logs'];
  instance?: ReleaseInstance;

  pods: PodInstance[] = [];
  podsLoaded = false;

  constructor() {
    super();
  }

  override updateDataSource(instances: ReleaseInstance[]): void {
    const release =
      this.route.snapshot.paramMap.get('release') ?? this.route.parent?.snapshot.paramMap.get('release') ?? '';

    this.instance = instances.find(
      r => r.metadata.name === release && r.metadata.namespace === this.currentProjectName
    );

    if (this.instance) {
      this.updateDataSourceForInstance(this.instance);
    }
  }

  getStatus(status: string): [string, string] {
    return ToStatusView(status);
  }

  updateDataSourceForInstance(instance: ReleaseInstance): void {
    const name = instance?.metadata?.name;

    if (!name) {
      console.warn('Skipping pod info fetch: instance name is missing.', instance);
      this.pods = [];
      this.podsLoaded = true;
      return;
    }

    this.podInfoService.list(this.currentClusterId, this.currentProjectName, name).subscribe({
      next: pods => {
        this.pods = pods.map(pod => {
          const [statusLabel, statusIcon] = ToStatusView(pod.state);
          const [healthLabel, healthIcon] = ToStatusView(pod.health);
          return {
            ...pod,
            statusLabel,
            statusIcon,
            statusText: pod.state,
            healthLabel,
            healthIcon,
            healthText: pod.health,
          };
        });
        this.podsLoaded = true;
      },
      error: err => {
        this.notificationService.onError(
          name,
          this.currentProjectName,
          this.currentCatalog.id,
          `Failed to fetch pods: ${errorMessage(err)}`
        );
        this.pods = [];
        this.podsLoaded = true;
      },
    });
  }
}
