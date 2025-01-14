import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent {
  @Input() found: boolean = true;
  @Input() noItemsLabel: string = 'No items found.';
  @Output() searchChanged = new EventEmitter<string>();

  searchFilter: string = '';

  SearchFilterComponent() {}

  onSearchChange(): void {
    this.searchChanged.emit(this.searchFilter);
  }

  onReset(): void {
    this.searchFilter = '';
    this.searchChanged.emit(this.searchFilter);
  }
}
