import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  LanguageService,
  type LanguageOption,
} from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  private readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  get currentLanguage(): LanguageOption {
    return this.languageService.getCurrentLanguageOption();
  }
  get availableLanguages(): LanguageOption[] {
    return this.languageService.availableLanguages;
  }
  onLanguageSelect(language: LanguageOption): void {
    this.languageService.setLanguage(language.code);
  }
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
  getTooltipText(): string {
    return this.translationService.translate('change-language');
  }
}

