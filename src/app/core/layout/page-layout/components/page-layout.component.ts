import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../navbar';
import { SidebarComponent } from '../../sidebar';
import { TitleBarComponent } from '../../../../shared/components/title-bar';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, TitleBarComponent, MatIconModule, RouterOutlet, RouterLink],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent {
  constructor() {}
}
