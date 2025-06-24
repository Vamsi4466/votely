// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'poll-app-theme';

  constructor() {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved === 'dark') {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem(this.THEME_KEY, 'dark');
  }

  enableLightMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem(this.THEME_KEY, 'light');
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.isDarkMode() ? 'dark' : 'light';
  }
}
