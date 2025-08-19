import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrimWhiteSpacePipe } from '../../../pipes';

@Component({
  selector: 'app-nav-tabs',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TrimWhiteSpacePipe],
  providers: [TrimWhiteSpacePipe],
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.scss'],
  animations: [],
})
export class NavTabsComponent implements AfterViewInit {
  @Input() basePath: string = '';
  @Input() items: string[] = [];
  @Input() display: string = '';

  @Output() tabChange = new EventEmitter<string>();

  @ViewChildren('tab') tabElements!: QueryList<ElementRef>;
  @ViewChild('tabList') tabList!: ElementRef;

  selectedTabIndex = 0;
  indicatorWidth = 0;
  indicatorLeft = 0;

  constructor(
    private trimWhiteSpacePipe: TrimWhiteSpacePipe,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  onTabChange(item: string): void {
    item = this.trimWhiteSpacePipe.transform(item);
    this.tabChange.emit(item);
  }

  getRouterLink(item: string): any[] {
    const segment = item.replace(/\s/g, '').toLowerCase();
    return this.basePath ? [this.basePath, segment] : [segment];
  }

  ngAfterViewInit() {
    this.setSelectedTabFromUrl();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.setSelectedTabFromUrl();
      });

    window.addEventListener('resize', () => this.updateIndicator());
  }

  activateTab(idx: number, item: string) {
    this.selectedTabIndex = idx;
    this.onTabChange(item);
    this.updateIndicator();
    this.navigate(item);
  }

  updateIndicator() {
    setTimeout(() => {
      const tabs = this.tabElements.toArray();
      const activeTab = tabs[this.selectedTabIndex]?.nativeElement;
      if (activeTab) {
        this.indicatorWidth = activeTab.offsetWidth;
        this.indicatorLeft = activeTab.offsetLeft;
      }
    });
  }

  navigate(item: string) {
    const segment = item.replace(/\s/g, '').toLowerCase();
    if (!this.basePath) {
      this.router.navigate([segment], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: '',
      });
    }
  }

  setSelectedTabFromUrl() {
    const pathOnly = this.router.url.split('?')[0];
    const segments = pathOnly.split('/').filter(Boolean);
    const currentTabSegment = segments[segments.length - 1] ?? '';

    const tabIndex = this.items.findIndex(
      item => item.replace(/\s/g, '').toLowerCase() === currentTabSegment.toLowerCase()
    );

    if (tabIndex > -1) {
      this.selectedTabIndex = tabIndex;
      this.updateIndicator();
    }
  }
}
