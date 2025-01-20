import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DropdownItem } from '../../dropdown-with-filter';

@Component({
  selector: 'app-kebab-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './kebab-menu.component.html',
  styleUrls: ['./kebab-menu.component.scss'],
  animations: [],
})
export class KebabMenuComponent {
  @Input() options: DropdownItem[] = [];
  @Output() selectionChange = new EventEmitter<DropdownItem>();

  constructor() {}

  selectOption(option: DropdownItem) {
    this.selectionChange.emit(option);
  }
}
