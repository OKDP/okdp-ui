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
