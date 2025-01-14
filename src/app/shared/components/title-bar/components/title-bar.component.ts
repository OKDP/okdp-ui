import { Component, OnInit } from '@angular/core';
import { TitleBarService } from '..';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
  animations: [],
})
export class TitleBarComponent implements OnInit {
  title: string = '';
  icon: string = '';

  constructor(private titleBarService: TitleBarService) {}

  ngOnInit() {
    this.titleBarService.currentTitle.subscribe(menu => {
      const titleItem = this.titleBarService.getTitle(menu);
      this.title = titleItem.title;
      this.icon = titleItem.icon;
    });
  }
}
