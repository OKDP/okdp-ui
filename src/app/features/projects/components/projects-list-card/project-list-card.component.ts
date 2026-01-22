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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectProject } from '../../../../core/common/projects';
import { Project } from '../../../../api/_model';
import { ProjectView, ToStatusView } from '../../../../model';
import { LoadingComponent } from '../../../../shared/components/loading';
import { TitleCasePipe } from '../../../../shared/pipes';
import { ContentToolbarComponent } from '../../../../shared/components/content-toolbar';
import { AbstractProjectBaseComponent } from '../../shared';
import { DialogComponent } from '../../../../shared/components/dialog';

@Component({
  selector: 'app-project-list-card',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    MatTooltipModule,
    LoadingComponent,
    TitleCasePipe,
    ContentToolbarComponent,
    DialogComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.scss'],
})
export class ProjectListCardComponent extends AbstractProjectBaseComponent implements OnInit {
  projects: ProjectView[] = [];

  hoveredProject: any = null;

  deletedItems: any[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.onInit();
  }

  isAllSelected() {
    return false;
  }

  masterToggle() {}

  toggleSelection(project: Project) {}

  onDelete(project: ProjectView) {
    super.onDeleteProject(project.name);
  }

  onEdit(project: ProjectView) {
    super.edit(project.name);
  }

  onSwitch(project: ProjectView) {
    super.switch(project.name);
  }

  onFavorite(project: ProjectView) {}

  override updateDataSource(projects: Project[]): void {
    this.projects = projects.map(project => {
      const [statusLabel, statusIcon] = ToStatusView(project.status);
      return { ...project, statusLabel, statusIcon };
    });

    this.store.dispatch(selectProject({ projectName: this.currentProjectName }));
  }
}
