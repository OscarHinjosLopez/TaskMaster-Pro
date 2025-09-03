import { Injectable, signal, effect, LOCALE_ID, inject } from '@angular/core';
import { TranslationService } from './translation.service';
export type SupportedLanguage = 'es' | 'en';
export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
  displayName: string;
}
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly STORAGE_KEY = 'selected-language';
  private readonly localeId = inject(LOCALE_ID);
  private readonly translationService = inject(TranslationService);
  readonly availableLanguages: LanguageOption[] = [
    {
      code: 'es',
      name: 'Español',
      flag: '🇪🇸',
      displayName: 'Español',
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      displayName: 'English',
    },
  ];
  readonly currentLanguage = signal<SupportedLanguage>(
    this.getInitialLanguage()
  );
  constructor() {
    this.translationService.setLanguage(this.currentLanguage());
  }
  private readonly languageWatcher = effect(
    () => {
      const lang = this.currentLanguage();
      this.saveLanguagePreference(lang);
      this.translationService.setLanguage(lang);
    },
    { allowSignalWrites: true }
  );
  private getInitialLanguage(): SupportedLanguage {
    if (this.localeId && this.localeId.startsWith('en')) {
      return 'en';
    } else if (this.localeId && this.localeId.startsWith('es')) {
      return 'es';
    }
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage;
      if (
        saved &&
        this.availableLanguages.some((lang) => lang.code === saved)
      ) {
        return saved;
      }
    }
    const browserLang =
      typeof navigator !== 'undefined'
        ? (navigator.language.split('-')[0] as SupportedLanguage)
        : 'es';
    return this.availableLanguages.some((lang) => lang.code === browserLang)
      ? browserLang
      : 'es';
  }
  private saveLanguagePreference(language: SupportedLanguage): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, language);
    }
  }
  setLanguage(language: SupportedLanguage): void {
    if (this.availableLanguages.some((lang) => lang.code === language)) {
      this.currentLanguage.set(language);
      this.saveLanguagePreference(language);
      this.translationService.setLanguage(language);
      if (this.isDevelopmentMode()) {
        this.showLanguageChangeNotification(language);
        return;
      }
      this.showLanguageChangeNotification(language);
      setTimeout(() => {
        this.reloadWithLanguage(language);
      }, 1000);
    }
  }
  private showLanguageChangeNotification(language: SupportedLanguage): void {
    const languageName =
      this.availableLanguages.find((lang) => lang.code === language)
        ?.displayName || language;
  }
  toggleLanguage(): void {
    const current = this.currentLanguage();
    const newLang = current === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }
  getCurrentLanguageOption(): LanguageOption {
    return (
      this.availableLanguages.find(
        (lang) => lang.code === this.currentLanguage()
      ) || this.availableLanguages[0]
    );
  }
  private reloadWithLanguage(language: SupportedLanguage): void {
    if (typeof window !== 'undefined') {
      if (this.isDevelopmentMode()) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        window.location.href = url.toString();
      } else {
        const currentUrl = window.location.pathname;
        const baseUrl = window.location.origin;
        if (language === 'es') {
          window.location.href = `${baseUrl}${currentUrl}`;
        } else {
          window.location.href = `${baseUrl}/${language}${currentUrl}`;
        }
      }
    }
  }
  private isDevelopmentMode(): boolean {
    return (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
    );
  }
}
