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
