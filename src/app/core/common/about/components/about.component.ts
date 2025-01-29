import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RightSidebarToggle, RightSidebarService } from '../../../../shared/services';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [],
})
export class AboutComponent implements OnInit {
  isToggled = false;

  constructor(private rightSidebarService: RightSidebarService) {}

  ngOnInit() {
    this.rightSidebarService.toggleSideBar$
      .pipe(filter(event => event.name === RightSidebarToggle.ABOUT))
      .subscribe(event => (this.isToggled = event.isToggle));
  }

  hideSidebar() {
    this.rightSidebarService.toggle(RightSidebarToggle.ABOUT);
  }

  get env() {
    return {
      version: environment.version,
      isSnaphsot: environment.version.toLowerCase().includes('-snapshot'.toLowerCase()),
    };
  }
}
