import { Injectable } from '@angular/core';
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionStart = Date.now();
  constructor() {
    this.trackSession();
  }
  private track(event: AnalyticsEvent): void {
    const enhancedEvent = {
      ...event,
      timestamp: Date.now(),
      session_id: this.sessionStart,
      user_agent: navigator.userAgent,
      page_url: window.location.pathname,
    };
    this.events.push(enhancedEvent);
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }
  }
  trackTaskCreated(category: string = 'general'): void {
    this.track({
      action: 'task_created',
      category: 'task_management',
      label: category,
    });
  }
  trackTaskCompleted(): void {
    this.track({
      action: 'task_completed',
      category: 'task_management',
    });
  }
  trackTaskDeleted(): void {
    this.track({
      action: 'task_deleted',
      category: 'task_management',
    });
  }
  trackTaskEdited(): void {
    this.track({
      action: 'task_edited',
      category: 'task_management',
    });
  }
  trackBulkAction(action: string, count?: number): void {
    this.track({
      action: `bulk_${action}`,
      category: 'bulk_operations',
      value: count,
    });
  }
  trackSearch(searchTerm: string): void {
    this.track({
      action: 'search_performed',
      category: 'search',
      label: searchTerm.length > 0 ? 'with_term' : 'empty',
    });
  }
  trackFilter(filterType: string, filterValue: string): void {
    this.track({
      action: 'filter_applied',
      category: 'filtering',
      label: filterType,
      custom_parameters: {
        filter_value: filterValue,
      },
    });
  }
  trackFeatureUsage(feature: string): void {
    this.track({
      action: 'feature_used',
      category: 'ui_interaction',
      label: feature,
    });
  }
  trackThemeToggle(theme: 'light' | 'dark'): void {
    this.track({
      action: 'theme_changed',
      category: 'personalization',
      label: theme,
    });
  }
  trackExport(format: string): void {
    this.track({
      action: 'data_exported',
      category: 'data_management',
      label: format,
    });
  }
  trackImport(itemCount: number): void {
    this.track({
      action: 'data_imported',
      category: 'data_management',
      value: itemCount,
    });
  }
  trackProductivitySession(duration: number, tasksCompleted: number): void {
    this.track({
      action: 'productivity_session',
      category: 'productivity',
      value: duration,
      custom_parameters: {
        tasks_completed: tasksCompleted,
        productivity_rate: tasksCompleted / (duration / 60), // tasks per minute
      },
    });
  }
  trackDailyGoal(achieved: boolean, completionRate: number): void {
    this.track({
      action: 'daily_goal',
      category: 'productivity',
      label: achieved ? 'achieved' : 'not_achieved',
      value: completionRate,
    });
  }
  trackError(error: Error, context?: string): void {
    this.track({
      action: 'error_occurred',
      category: 'errors',
      label: context || 'unknown',
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack,
      },
    });
  }
  trackPerformance(action: string, duration: number): void {
    this.track({
      action: 'performance_metric',
      category: 'performance',
      label: action,
      value: duration,
    });
  }
  private trackSession(): void {
    this.track({
      action: 'session_start',
      category: 'session',
    });
    window.addEventListener('beforeunload', () => {
      this.track({
        action: 'session_end',
        category: 'session',
        value: Date.now() - this.sessionStart,
      });
    });
  }
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
  getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.events.filter((event) => event.category === category);
  }
  getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
    return this.events.filter((event) => {
      const timestamp = (event as any).timestamp;
      return timestamp >= startTime && timestamp <= endTime;
    });
  }
  getTopActions(limit: number = 10): { action: string; count: number }[] {
    const actionCounts: Record<string, number> = {};
    this.events.forEach((event) => {
      actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
    });
    return Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([action, count]) => ({ action, count }));
  }
  getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }
  private isProduction(): boolean {
    return (
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    );
  }
  clearEvents(): void {
    this.events = [];
  }
  exportAnalytics(): string {
    const analyticsData = {
      events: this.events,
      session_duration: this.getSessionDuration(),
      top_actions: this.getTopActions(),
      total_events: this.events.length,
      export_timestamp: Date.now(),
    };
    return JSON.stringify(analyticsData, null, 2);
  }
}
