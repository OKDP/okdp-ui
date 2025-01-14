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
