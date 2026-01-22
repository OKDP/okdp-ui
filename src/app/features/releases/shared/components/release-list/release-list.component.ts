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

import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchFilterComponent, SearchFilterService } from '../../../../../shared/components/search-filter';
import { ContentToolbarComponent } from '../../../../../shared/components/content-toolbar';
import { DialogComponent } from '../../../../../shared/components/dialog';

@Component({
  selector: 'app-release-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ContentToolbarComponent, SearchFilterComponent, DialogComponent],
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.scss'],
})
export class ReleaseListComponent implements OnInit {
  filtredItems: string[] = [];

  private currentCatalogId: string = '';

  // Deletion
  showDialog = false;
  deletedItems: any[] = [];

  constructor(
    private searchFilterService: SearchFilterService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const service = params.get('service') || '-';
      this.currentCatalogId = service;
    });
  }

  add(): void {
    this.router.navigate([`/services/${this.currentCatalogId}/select`]);
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
