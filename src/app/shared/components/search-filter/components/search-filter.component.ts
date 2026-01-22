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

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit {
  @Input() found: boolean = true;
  @Input() noItemsLabel: string = 'No items found.';
  @Output() searchChanged = new EventEmitter<string>();

  searchFilter: string = '';

  ngOnInit(): void {
    this.onReset();
  }

  SearchFilterComponent() {}

  onSearchChange(): void {
    this.searchChanged.emit(this.searchFilter);
  }

  onReset(): void {
    this.searchFilter = '';
    this.searchChanged.emit(this.searchFilter);
  }
}
