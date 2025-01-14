import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
export class NavTabsComponent {
  @Input() basePath: string = '';
  @Input() items: string[] = [];
  @Input() display: string = '';

  @Output() tabChange = new EventEmitter<string>();

  constructor(private trimWhiteSpacePipe: TrimWhiteSpacePipe) {}

  onTabChange(item: string): void {
    item = this.trimWhiteSpacePipe.transform(item);
    this.tabChange.emit(item);
  }
}
