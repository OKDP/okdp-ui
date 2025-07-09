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
