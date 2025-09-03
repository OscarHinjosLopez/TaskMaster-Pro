import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslationService } from './translation.service';
export interface AppSettings {
  tasksPerPage: number;
  defaultView: 'list' | 'grid' | 'kanban';
  showCompletedTasks: boolean;
  groupTasksByCategory: boolean;
  showTaskNumbers: boolean;
  autoSave: boolean;
  confirmDelete: boolean;
  markCompleteOnClick: boolean;
  sortBy: 'date' | 'priority' | 'name' | 'category';
  sortOrder: 'asc' | 'desc';
  enableNotifications: boolean;
  notifyOnDeadline: boolean;
  notifyBeforeDeadline: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  enableAutoBackup: boolean;
  backupInterval: number;
  maxBackups: number;
  compressBackups: boolean;
  enableAnalytics: boolean;
  shareAnonymousData: boolean;
  trackProductivity: boolean;
  enableBetaFeatures: boolean;
  debugMode: boolean;
  customCss: string;
  language: 'es' | 'en' | 'fr';
}
const DEFAULT_SETTINGS: AppSettings = {
  tasksPerPage: 10,
  defaultView: 'list',
  showCompletedTasks: true,
  groupTasksByCategory: false,
  showTaskNumbers: false,
  autoSave: true,
  confirmDelete: true,
  markCompleteOnClick: false,
  sortBy: 'date',
  sortOrder: 'desc',
  enableNotifications: true,
  notifyOnDeadline: true,
  notifyBeforeDeadline: 15,
  soundEnabled: true,
  vibrationEnabled: true,
  enableAutoBackup: true,
  backupInterval: 24,
  maxBackups: 5,
  compressBackups: true,
  enableAnalytics: true,
  shareAnonymousData: false,
  trackProductivity: true,
  enableBetaFeatures: false,
  debugMode: false,
  customCss: '',
  language: 'es',
};
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settings = signal<AppSettings>(DEFAULT_SETTINGS);
  private readonly _isLoading = signal(true);
  private readonly _lastSaved = signal<Date | null>(null);
  private readonly translationService = inject(TranslationService);
  readonly settings = this._settings.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly lastSaved = this._lastSaved.asReadonly();
  readonly displaySettings = computed(() => ({
    tasksPerPage: this._settings().tasksPerPage,
    defaultView: this._settings().defaultView,
    showCompletedTasks: this._settings().showCompletedTasks,
    groupTasksByCategory: this._settings().groupTasksByCategory,
    showTaskNumbers: this._settings().showTaskNumbers,
  }));
  readonly behaviorSettings = computed(() => ({
    autoSave: this._settings().autoSave,
    confirmDelete: this._settings().confirmDelete,
    markCompleteOnClick: this._settings().markCompleteOnClick,
    sortBy: this._settings().sortBy,
    sortOrder: this._settings().sortOrder,
  }));
  readonly notificationSettings = computed(() => ({
    enableNotifications: this._settings().enableNotifications,
    notifyOnDeadline: this._settings().notifyOnDeadline,
    notifyBeforeDeadline: this._settings().notifyBeforeDeadline,
    soundEnabled: this._settings().soundEnabled,
    vibrationEnabled: this._settings().vibrationEnabled,
  }));
  readonly privacySettings = computed(() => ({
    enableAnalytics: this._settings().enableAnalytics,
    shareAnonymousData: this._settings().shareAnonymousData,
    trackProductivity: this._settings().trackProductivity,
  }));
  constructor(private storageService: StorageService) {
    this.loadSettings();
    this.setupAutoSave();
  }
  private async loadSettings(): Promise<void> {
    try {
      const saved = await this.storageService.getItem<AppSettings>(
        'app_settings'
      );
      if (saved) {
        const mergedSettings = { ...DEFAULT_SETTINGS, ...saved };
        this._settings.set(mergedSettings);
      }
    } catch (error) {
      console.warn(
        this.translationService.translate('failed-to-load-settings'),
        error
      );
    } finally {
      this._isLoading.set(false);
    }
  }
  private setupAutoSave(): void {
    effect(() => {
      if (!this._isLoading()) {
        this.saveSettings();
      }
    });
  }
  private async saveSettings(): Promise<void> {
    try {
      await this.storageService.setItem('app_settings', this._settings());
      this._lastSaved.set(new Date());
    } catch (error) {
      console.error(
        this.translationService.translate('failed-to-save-settings'),
        error
      );
    }
  }
  updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): void {
    this._settings.update((current) => ({
      ...current,
      [key]: value,
    }));
  }
  updateSettings(partial: Partial<AppSettings>): void {
    this._settings.update((current) => ({
      ...current,
      ...partial,
    }));
  }
  resetSettings(): void {
    this._settings.set({ ...DEFAULT_SETTINGS });
  }
  resetCategory(
    category:
      | 'display'
      | 'behavior'
      | 'notifications'
      | 'data'
      | 'analytics'
      | 'advanced'
  ): void {
    const defaults = DEFAULT_SETTINGS;
    switch (category) {
      case 'display':
        this.updateSettings({
          tasksPerPage: defaults.tasksPerPage,
          defaultView: defaults.defaultView,
          showCompletedTasks: defaults.showCompletedTasks,
          groupTasksByCategory: defaults.groupTasksByCategory,
          showTaskNumbers: defaults.showTaskNumbers,
        });
        break;
      case 'behavior':
        this.updateSettings({
          autoSave: defaults.autoSave,
          confirmDelete: defaults.confirmDelete,
          markCompleteOnClick: defaults.markCompleteOnClick,
          sortBy: defaults.sortBy,
          sortOrder: defaults.sortOrder,
        });
        break;
      case 'notifications':
        this.updateSettings({
          enableNotifications: defaults.enableNotifications,
          notifyOnDeadline: defaults.notifyOnDeadline,
          notifyBeforeDeadline: defaults.notifyBeforeDeadline,
          soundEnabled: defaults.soundEnabled,
          vibrationEnabled: defaults.vibrationEnabled,
        });
        break;
      case 'data':
        this.updateSettings({
          enableAutoBackup: defaults.enableAutoBackup,
          backupInterval: defaults.backupInterval,
          maxBackups: defaults.maxBackups,
          compressBackups: defaults.compressBackups,
        });
        break;
      case 'analytics':
        this.updateSettings({
          enableAnalytics: defaults.enableAnalytics,
          shareAnonymousData: defaults.shareAnonymousData,
          trackProductivity: defaults.trackProductivity,
        });
        break;
      case 'advanced':
        this.updateSettings({
          enableBetaFeatures: defaults.enableBetaFeatures,
          debugMode: defaults.debugMode,
          customCss: defaults.customCss,
          language: defaults.language,
        });
        break;
    }
  }
  exportSettings(): string {
    const exportData = {
      settings: this._settings(),
      version: '1.0',
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  }
  async importSettings(
    jsonString: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const importData = JSON.parse(jsonString);
      if (!importData.settings) {
        return {
          success: false,
          message: this.translationService.translate('invalid-file-format'),
        };
      }
      const validatedSettings = this.validateSettings(importData.settings);
      this._settings.set(validatedSettings);
      return {
        success: true,
        message: this.translationService.translate(
          'settings-imported-successfully'
        ),
      };
    } catch (error) {
      return {
        success: false,
        message: this.translationService.translate(
          'error-processing-settings-file'
        ),
      };
    }
  }
  private validateSettings(settings: any): AppSettings {
    const validated: any = { ...DEFAULT_SETTINGS };
    Object.keys(DEFAULT_SETTINGS).forEach((key) => {
      const typedKey = key as keyof AppSettings;
      if (settings[key] !== undefined) {
        switch (typeof DEFAULT_SETTINGS[typedKey]) {
          case 'boolean':
            validated[typedKey] = Boolean(settings[key]);
            break;
          case 'number':
            const num = Number(settings[key]);
            validated[typedKey] = isNaN(num) ? DEFAULT_SETTINGS[typedKey] : num;
            break;
          case 'string':
            validated[typedKey] = String(settings[key]);
            break;
          default:
            if (this.isValidEnumValue(typedKey, settings[key])) {
              validated[typedKey] = settings[key];
            }
        }
      }
    });
    return validated as AppSettings;
  }
  private isValidEnumValue(key: keyof AppSettings, value: any): boolean {
    const enumMaps = {
      defaultView: ['list', 'grid', 'kanban'],
      sortBy: ['date', 'priority', 'name', 'category'],
      sortOrder: ['asc', 'desc'],
      language: ['es', 'en', 'fr'],
    };
    const allowedValues = enumMaps[key as keyof typeof enumMaps];
    return allowedValues ? allowedValues.includes(value) : false;
  }
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this._settings()[key];
  }
  toggleSetting(key: keyof AppSettings): void {
    const current = this._settings()[key];
    if (typeof current === 'boolean') {
      this.updateSetting(key, !current as any);
    }
  }
  isValidTasksPerPage(value: number): boolean {
    return value >= 5 && value <= 100;
  }
  isValidBackupInterval(value: number): boolean {
    return value >= 1 && value <= 168;
  }
  isValidNotificationTime(value: number): boolean {
    return value >= 0 && value <= 1440;
  }
  getRecommendedSettings(): Partial<AppSettings> {
    return {
      tasksPerPage:
        this._settings().tasksPerPage < 10 ? 15 : this._settings().tasksPerPage,
      autoSave: true,
      enableNotifications: 'Notification' in window,
      enableAnalytics: this._settings().enableAnalytics,
    };
  }
  getPerformanceOptimizedSettings(): Partial<AppSettings> {
    return {
      tasksPerPage: 20,
      enableAnalytics: false,
      compressBackups: true,
      debugMode: false,
    };
  }
  getPrivacyFocusedSettings(): Partial<AppSettings> {
    return {
      enableAnalytics: false,
      shareAnonymousData: false,
      trackProductivity: false,
      enableAutoBackup: false,
    };
  }
}
