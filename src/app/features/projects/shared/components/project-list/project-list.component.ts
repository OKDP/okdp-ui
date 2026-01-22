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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SearchFilterComponent, SearchFilterService } from '../../../../../shared/components/search-filter';
import { ContentToolbarComponent } from '../../../../../shared/components/content-toolbar';
import { DialogComponent } from '../../../../../shared/components/dialog';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ContentToolbarComponent, SearchFilterComponent, DialogComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent {
  deletedItems: any[] = [];
  filtredItems: string[] = [];

  // Deletion
  showDialog = false;
  selectedProjects: string[] = [];

  constructor(
    private searchFilterService: SearchFilterService,
    private router: Router
  ) {}

  add(): void {
    let parentUrl = this.router.url;
    parentUrl = parentUrl.replace(/\/(table|card)$/, '');
    this.router.navigate([`/${parentUrl}/add`]);
  }

  deleteAll(): void {
    console.log('Items to delete:', this.deletedItems);
    for (const item of this.deletedItems) {
      console.log(`Name: ${item.name}, Display Name: ${item.displayName}`);
    }
  }

  onSearchChanged(search: string): void {
    this.searchFilterService.searchChanged(search);
  }

  onConfirmDeleteAll() {
    this.showDialog = false;
  }

  onCancelDeleteAll() {
    this.showDialog = false;
  }
}
