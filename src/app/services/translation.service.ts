import { Injectable, signal } from '@angular/core';
import type { SupportedLanguage } from './language.service';
interface Translation {
  [key: string]: string;
}
interface Translations {
  es: Translation;
  en: Translation;
}
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly translations: Translations = {
    es: {
      'app-title': 'TaskMaster Pro',
      'app-subtitle': 'Organiza tu vida, maximiza tu productividad',
      'total-tasks': 'Tareas Totales',
      'completed-tasks': 'Completadas',
      'pending-tasks': 'Pendientes',
      'add-new-task': 'Agregar Nueva Tarea',
      'new-task': 'Nueva Tarea',
      'organize-day-subtitle': 'Organiza tu día agregando nuevas tareas',
      'what-need-to-do': '¿Qué necesitas hacer?',
      'task-placeholder': 'Ej: Completar el proyecto de Angular',
      'add-task-button': 'Agregar Tarea',
      'clear-button': 'Limpiar',
      'adding-task': 'Agregando tarea...',
      'my-tasks': 'Mis Tareas',
      'loading-tasks': 'Cargando tareas...',
      'no-tasks': '¡No hay tareas!',
      'add-first-task': 'Agrega tu primera tarea para comenzar',
      'change-language': 'Cambiar idioma',
      'select-language': 'Seleccionar idioma',
      'header-title': 'Mi Lista de Tareas',
      'header-subtitle': 'Gestiona tus tareas de manera eficiente',
      'no-title': 'Sin título',
      'delete-task-aria': 'Eliminar tarea',
      'one-task-pending': '1 tarea pendiente',
      'multiple-tasks-pending': '{count} tareas pendientes',
      'footer-github': 'GitHub',
      'footer-linkedin': 'LinkedIn',
      'footer-contact': 'Contacto',
      'footer-copyright': 'Todos los derechos reservados',
      'footer-developed-by': 'Desarrollado por Oscar Hinjos López',
    },
    en: {
      'app-title': 'TaskMaster Pro',
      'app-subtitle': 'Organize your life, maximize your productivity',
      'total-tasks': 'Total Tasks',
      'completed-tasks': 'Completed',
      'pending-tasks': 'Pending',
      'add-new-task': 'Add New Task',
      'new-task': 'New Task',
      'organize-day-subtitle': 'Organize your day by adding new tasks',
      'what-need-to-do': 'What do you need to do?',
      'task-placeholder': 'Ex: Complete the Angular project',
      'add-task-button': 'Add Task',
      'clear-button': 'Clear',
      'adding-task': 'Adding task...',
      'my-tasks': 'My Tasks',
      'loading-tasks': 'Loading tasks...',
      'no-tasks': 'No tasks!',
      'add-first-task': 'Add your first task to get started',
      'change-language': 'Change language',
      'select-language': 'Select language',
      'header-title': 'My Task List',
      'header-subtitle': 'Manage your tasks efficiently',
      'no-title': 'No title',
      'delete-task-aria': 'Delete task',
      'one-task-pending': '1 pending task',
      'multiple-tasks-pending': '{count} pending tasks',
      'footer-github': 'GitHub',
      'footer-linkedin': 'LinkedIn',
      'footer-contact': 'Contact',
      'footer-copyright': 'All rights reserved',
      'footer-developed-by': 'Developed by Oscar Hinjos López',
      'failed-to-load-settings': 'Failed to load settings, using defaults:',
      'failed-to-save-settings': 'Failed to save settings:',
      'invalid-file-format': 'Invalid file format',
      'settings-imported-successfully': 'Settings imported successfully',
      'error-processing-settings-file': 'Error processing settings file',
    },
  };
  readonly currentLanguage = signal<SupportedLanguage>('es');
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage.set(language);
  }
  translate(key: string): string {
    const lang = this.currentLanguage();
    return this.translations[lang]?.[key] || this.translations.es[key] || key;
  }
  getAllTranslations(): Translation {
    const lang = this.currentLanguage();
    return this.translations[lang] || this.translations.es;
  }
}
