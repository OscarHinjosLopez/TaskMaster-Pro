import { Injectable, signal, effect } from '@angular/core';
export type Theme = 'light' | 'dark' | 'auto';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _currentTheme = signal<Theme>('auto');
  private readonly _isDarkMode = signal(false);
  readonly currentTheme = this._currentTheme.asReadonly();
  readonly isDarkMode = this._isDarkMode.asReadonly();
  constructor() {
    this.loadSavedTheme();
    this.setupThemeWatcher();
    this.setupMediaQueryListener();
  }
  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('taskmaster_theme') as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this._currentTheme.set(savedTheme);
    }
    this.updateDarkMode();
  }
  private setupThemeWatcher(): void {
    effect(() => {
      this.applyTheme();
      localStorage.setItem('taskmaster_theme', this._currentTheme());
    });
  }
  private setupMediaQueryListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (this._currentTheme() === 'auto') {
        this.updateDarkMode();
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Initial check
  }
  private updateDarkMode(): void {
    const theme = this._currentTheme();
    if (theme === 'dark') {
      this._isDarkMode.set(true);
    } else if (theme === 'light') {
      this._isDarkMode.set(false);
    } else {
      this._isDarkMode.set(
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
  }
  private applyTheme(): void {
    this.updateDarkMode();
    const isDark = this._isDarkMode();
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('dark-theme', isDark);
    this.updateMetaThemeColor(isDark);
    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: {
          theme: this._currentTheme(),
          isDark,
        },
      })
    );
  }
  private updateMetaThemeColor(isDark: boolean): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = isDark ? '#1f2937' : '#6366f1';
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }
  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
  }
  toggleTheme(): void {
    const current = this._currentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
  cycleTheme(): void {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(this._currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }
  getThemeIcon(): string {
    const theme = this._currentTheme();
    switch (theme) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      case 'auto':
        return 'brightness_auto';
      default:
        return 'brightness_auto';
    }
  }
  getThemeLabel(): string {
    const theme = this._currentTheme();
    switch (theme) {
      case 'light':
        return 'Modo Claro';
      case 'dark':
        return 'Modo Oscuro';
      case 'auto':
        return 'Automático';
      default:
        return 'Automático';
    }
  }
  getAvailableThemes(): { value: Theme; label: string; icon: string }[] {
    return [
      { value: 'light', label: 'Modo Claro', icon: 'light_mode' },
      { value: 'dark', label: 'Modo Oscuro', icon: 'dark_mode' },
      { value: 'auto', label: 'Automático', icon: 'brightness_auto' },
    ];
  }
  setCustomTheme(properties: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });
  }
  resetCustomTheme(): void {
    const root = document.documentElement;
    const customProperties = Array.from(root.style).filter((prop) =>
      prop.startsWith('--custom-')
    );
    customProperties.forEach((prop) => {
      root.style.removeProperty(prop);
    });
  }
  exportThemeConfig(): string {
    const config = {
      theme: this._currentTheme(),
      isDarkMode: this._isDarkMode(),
      timestamp: Date.now(),
    };
    return JSON.stringify(config, null, 2);
  }
  getThemeAwareColor(lightColor: string, darkColor: string): string {
    return this._isDarkMode() ? darkColor : lightColor;
  }
  interpolateColor(baseColor: string, opacity: number): string {
    const isDark = this._isDarkMode();
    const background = isDark ? '0, 0, 0' : '255, 255, 255';
    return `rgba(${background}, ${opacity})`;
  }
}

