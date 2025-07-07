import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleBarService } from '..';

@Component({
  selector: 'app-content-header-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-header-title.component.html',
  styleUrls: ['./content-header-title.component.scss'],
  animations: [],
})
export class ContentHeaderTitleComponent implements OnInit {
  title: string = '';
  icon: string = '';
  description: string = '';

  constructor(private titleBarService: TitleBarService) {}

  ngOnInit() {
    this.titleBarService.pageContentTitle$.subscribe(menu => {
      const titleItem = this.titleBarService.getTitle(menu);
      if (titleItem.title) this.title = titleItem.title;
      if (titleItem.icon) this.icon = titleItem.icon;
      if (titleItem.description) this.description = titleItem.description;
    });
  }
}
