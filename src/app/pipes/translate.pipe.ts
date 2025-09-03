import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';
@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Important: hace que el pipe sea impuro para detectar cambios en el idioma
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);
  transform(key: string, ...args: unknown[]): string {
    return this.translationService.translate(key);
  }
}

