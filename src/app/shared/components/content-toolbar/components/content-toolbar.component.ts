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

import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchFilterComponent, SearchFilterService } from '../../search-filter';

@Component({
  selector: 'app-content-toolbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, SearchFilterComponent],
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.scss'],
})
export class ContentToolbarComponent implements OnInit {
  @Input() viewModes: ('table' | 'card')[] = ['table', 'card'];

  viewMode: 'table' | 'card' = 'table';
  filtredItems: string[] = [];

  private readonly SESSION_KEY = 'content-toolbar-viewMode';

  private routeSub!: Subscription;

  constructor(
    private searchFilterService: SearchFilterService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadViewMode();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadViewMode();
      });
  }

  switchView(mode: 'table' | 'card') {
    this.viewMode = mode;
    sessionStorage.setItem(this.SESSION_KEY, mode);

    let path = this.router.url.replace(/\/(table|card)$/, '');
    if (mode === 'card') {
      path += '/card';
    }

    this.router.navigateByUrl(path);
  }

  onSearchChanged(search: string): void {
    this.searchFilterService.searchChanged(search);
  }

  private loadViewMode(): void {
    const saved = sessionStorage.getItem(this.SESSION_KEY) as 'table' | 'card' | null;
    this.viewMode = this.viewModes.includes(saved as any) ? (saved as any) : 'table';
    this.switchView(this.viewMode);
  }
}
