import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar';
import { SidebarComponent } from '../../sidebar';
import { ContentHeaderTitleComponent } from '../../../../shared/components/content-header-title';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    SidebarComponent,
    ContentHeaderTitleComponent,
    MatIconModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent {
  constructor() {}
}
