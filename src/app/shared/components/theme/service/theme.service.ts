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

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<'default' | 'light'>('default');
  currentTheme$ = this.currentTheme.asObservable();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Load the theme from sessionStorage on startup
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme as 'default' | 'light');
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme.value === 'default' ? 'light' : 'default';
    this.setTheme(newTheme);
  }

  private setTheme(theme: 'default' | 'light') {
    this.currentTheme.next(theme);

    sessionStorage.setItem('theme', theme);

    if (theme === 'light') {
      this.renderer.addClass(document.documentElement, 'light');
    } else {
      this.renderer.removeClass(document.documentElement, 'light');
    }
  }

  getTheme(): 'default' | 'light' {
    return this.currentTheme.value;
  }
}
