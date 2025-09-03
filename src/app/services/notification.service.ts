import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };
  private readonly configByType: Record<
    NotificationType,
    Partial<MatSnackBarConfig>
  > = {
    success: {
      panelClass: ['success-snackbar'],
      duration: 3000,
    },
    error: {
      panelClass: ['error-snackbar'],
      duration: 5000,
    },
    warning: {
      panelClass: ['warning-snackbar'],
      duration: 4000,
    },
    info: {
      panelClass: ['info-snackbar'],
      duration: 3000,
    },
  };
  showSuccess(message: string, action = 'Cerrar'): void {
    this.show(message, action, 'success');
  }
  showError(message: string, action = 'Cerrar'): void {
    this.show(message, action, 'error');
  }
  showWarning(message: string, action = 'Cerrar'): void {
    this.show(message, action, 'warning');
  }
  showInfo(message: string, action = 'Cerrar'): void {
    this.show(message, action, 'info');
  }
  private show(message: string, action: string, type: NotificationType): void {
    const config = {
      ...this.defaultConfig,
      ...this.configByType[type],
    };
    this.snackBar.open(message, action, config);
  }
  showCustom(message: string, action: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config,
    });
  }
  dismiss(): void {
    this.snackBar.dismiss();
  }
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission === 'denied') {
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  async showBrowserNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    const hasPermission = await this.requestNotificationPermission();
    if (!hasPermission) {
      this.showWarning('No se pueden mostrar notificaciones del navegador');
      return;
    }
    const defaultOptions: NotificationOptions = {
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      tag: 'taskmaster',
      requireInteraction: false,
      ...options,
    };
    if (
      'serviceWorker' in navigator &&
      'showNotification' in ServiceWorkerRegistration.prototype
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, defaultOptions);
      });
    } else {
      new Notification(title, defaultOptions);
    }
  }
  async showTaskReminder(taskText: string): Promise<void> {
    await this.showBrowserNotification(`Recordatorio: ${taskText}`, {
      body: 'No olvides completar esta tarea',
      tag: 'task-reminder',
      requireInteraction: true,
    });
  }
  async showTaskCompleted(taskText: string): Promise<void> {
    await this.showBrowserNotification('¡Tarea completada! 🎉', {
      body: `Has completado: ${taskText}`,
      tag: 'task-completed',
    });
  }
  async showDailySummary(
    completedTasks: number,
    totalTasks: number
  ): Promise<void> {
    const percentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    await this.showBrowserNotification('Resumen del día', {
      body: `Has completado ${completedTasks} de ${totalTasks} tareas (${percentage}%)`,
      tag: 'daily-summary',
    });
  }
}

