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
