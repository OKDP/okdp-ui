import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EndpointsFromUsagePipe, TitleCasePipe } from '../../../../shared/pipes';
import { LoadingComponent } from '../../../../shared/components/loading';
import { KebabMenuComponent } from '../../../../shared/components/kebab-menu';
import { ReleaseInstance } from '../../../../model';
import { ContentToolbarComponent } from '../../../../shared/components/content-toolbar';
import { AbstractReleaseBaseComponent } from '../../shared';

@Component({
  selector: 'app-releases-list-card',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    LoadingComponent,
    KebabMenuComponent,
    ContentToolbarComponent,
    TitleCasePipe,
  ],
  providers: [EndpointsFromUsagePipe],
  templateUrl: './release-list-card.component.html',
  styleUrls: ['./release-list-card.component.scss'],
  animations: [],
})
export class ReleaseListCardComponent extends AbstractReleaseBaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    super.onInit();
  }

  highlightMatch(item: string | undefined): string | undefined {
    if (!this.search) return item;
    const query = this.search;
    const regex = new RegExp(`(${query})`, 'gi');
    return item?.replace(regex, '<mark class="text-okdp text-nowrap">$1</mark>');
  }

  override updateDataSource(instances: ReleaseInstance[]): void {}

  onDelete(instance: ReleaseInstance) {
    super.delete(instance.metadata.name!);
  }

  onEdit(instance: ReleaseInstance) {
    super.edit(instance.metadata.name!);
  }

  onFavorite(row: ReleaseInstance) {}
}
