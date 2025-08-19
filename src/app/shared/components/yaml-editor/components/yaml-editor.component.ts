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
