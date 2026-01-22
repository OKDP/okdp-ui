/**
 * Copyright 2026 The OKDP Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
