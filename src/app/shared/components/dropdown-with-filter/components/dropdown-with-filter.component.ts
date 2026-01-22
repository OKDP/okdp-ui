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
import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { DropdownItem } from '../model/dropdown-item.model';

@Component({
  selector: 'app-dropdown-with-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-with-filter.component.html',
  styleUrls: ['./dropdown-with-filter.component.scss'],
})
export class DropdownWithFilterComponent implements OnChanges {
  @Input() orientation: 'top' | 'bottom' = 'bottom';
  @Input() scrollable: boolean = true;
  @Input() label: string = 'Filter ...';
  @Input() noItemsLabel: string = 'No items found.';
  @Input() options: DropdownItem[] = [];
  @Output() selectionChange = new EventEmitter<DropdownItem>();

  filteredOptions: DropdownItem[] = [];
  filterText: string = '';
  selectedOption: DropdownItem | null = null;
  isDropdownOpen: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue) {
      this.filteredOptions = [...changes['options'].currentValue];
      this.selectedOption = this.filteredOptions[0];
    }
  }

  filterOptions() {
    this.filteredOptions = this.options.filter(option =>
      option.value.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  selectOption(option: DropdownItem) {
    this.selectedOption = option;
    this.selectionChange.emit(option);
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterText = '';
      this.filteredOptions = [...this.options];
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.dropdown-filter-container')) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:mouseover', ['$event'])
  closeDropdownOnMouseLeave(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.dropdown-filter-container') && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
}
