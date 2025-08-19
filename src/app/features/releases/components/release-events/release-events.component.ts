import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../../../../shared/components/loading';
import { K8sEvent, ReleaseInstance } from '../../../../model';
import { ReleaseEventsService } from '../../services/release-events.service';
import { AbstractReleaseInstanceComponent } from '../../shared/components/release-instance/release-instance.component';

@Component({
  selector: 'app-release-events',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './release-events.component.html',
  styleUrls: ['./release-events.component.scss'],
  animations: [],
})
export class ReleaseEventComponent extends AbstractReleaseInstanceComponent implements OnInit {
  events: K8sEvent[] = [];

  constructor(private releaseEventsService: ReleaseEventsService) {
    super();
  }

  override updateDataSourceForInstance(instance: ReleaseInstance): void {
    const clusterId = this.currentClusterId;
    const namespace = instance.metadata.namespace!;
    const releaseName = instance.metadata.name!;

    this.releaseEventsService
      .list(clusterId, namespace, releaseName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: events => {
          this.events = events || [];
        },
        error: () => {
          this.events = [];
        },
      });
  }
}
