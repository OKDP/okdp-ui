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

import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { stringify } from 'yaml';
import 'prismjs';
import 'prismjs/components/prism-yaml';
import { CommonModule } from '@angular/common';

declare let Prism: any;

@Component({
  selector: 'app-yaml-editor',
  imports: [CommonModule],
  templateUrl: './yaml-editor.component.html',
  styleUrls: ['./yaml-editor.component.scss'],
  standalone: true,
})
export class YamlEditorComponent implements AfterViewInit, OnChanges {
  @Input() jsonObj: any = {};

  @ViewChild('codeBlock', { static: false }) codeBlock!: ElementRef<HTMLElement>;

  yamlText: string = '';

  ngAfterViewInit() {
    this.highlight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.yamlText = stringify(this.jsonObj ?? {});
    this.highlight();
  }

  highlight() {
    setTimeout(() => {
      if (this.codeBlock) {
        Prism.highlightElement(this.codeBlock.nativeElement);
      }
    }, 0);
  }
}
