import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleBarService } from '../../../shared/components/content-header-title';
import { ErrorComponent } from '../../../shared/error';
import { SidebarService } from '../../../core/layout/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ErrorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [],
})
export class HomeComponent implements OnInit {
  constructor(
    private sidebarService: SidebarService,
    private titleBarService: TitleBarService
  ) {}

  ngOnInit(): void {
    this.titleBarService.setCurrentMenu('home');
    this.sidebarService.setActiveMenu('home');
  }
}
