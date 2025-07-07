import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchFilterComponent, SearchFilterService } from '../../search-filter';

@Component({
  selector: 'app-content-toolbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, SearchFilterComponent],
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.scss'],
})
export class ContentToolbarComponent {
  @Input() viewMode: 'table' | 'card' = 'card';
  @Input() viewModes: ('table' | 'card')[] = ['table', 'card'];

  filtredItems: string[] = [];

  constructor(
    private searchFilterService: SearchFilterService,
    private router: Router
  ) {}

  switchView(mode: 'table' | 'card') {
    let path = this.router.url;

    path = path.replace(/\/(table|card)$/, '');

    this.viewMode = mode;
    this.router.navigate([`${path}/${mode}`]);
  }

  onSearchChanged(search: string): void {
    this.searchFilterService.searchChanged(search);
  }
}
