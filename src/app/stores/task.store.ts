import { Injectable, computed, signal } from '@angular/core';
export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaCreacion: Date;
  fechaCompletada?: Date;
  fechaLimite?: Date;
  categoria: 'personal' | 'trabajo' | 'estudio' | 'hogar' | 'salud' | 'finanzas' | 'social';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  subtareas: string[];
  etiquetas: string[];
  tiempoEstimado: number; // in minutes
  tiempoReal: number; // in minutes
  recordatorios: Date[];
  comentarios: string[];
  archivosAdjuntos: string[];
  archivada?: boolean;
  texto?: string;
}
export interface TaskFilter {
  status: 'all' | 'pending' | 'completed';
  categoria?: string;
  prioridad?: string;
  searchTerm?: string;
}
@Injectable({
  providedIn: 'root'
})
export class TaskStore {
  private readonly _tasks = signal<Tarea[]>([]);
  private readonly _filter = signal<TaskFilter>({ status: 'all' });
  private readonly _isLoading = signal(false);
  private readonly _selectedTasks = signal<string[]>([]);
  readonly tasks = this._tasks.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly selectedTasks = this._selectedTasks.asReadonly();
  readonly totalTasks = computed(() => this.tasks().length);
  readonly completedTasks = computed(() =>
    this.tasks().filter(t => t.completada).length
  );
  readonly pendingTasks = computed(() =>
    this.totalTasks() - this.completedTasks()
  );
  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.filter();
    return tasks.filter(task => {
      if (filter.status === 'pending' && task.completada) return false;
      if (filter.status === 'completed' && !task.completada) return false;
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        const taskText = task.titulo || task.texto || '';
        if (!taskText.toLowerCase().includes(searchTerm)) return false;
      }
      if (filter.categoria && task.categoria !== filter.categoria) return false;
      if (filter.prioridad && task.prioridad !== filter.prioridad) return false;
      return true;
    });
  });
  readonly completionRate = computed(() => {
    const total = this.totalTasks();
    return total > 0 ? Math.round((this.completedTasks() / total) * 100) : 0;
  });
  setTasks(tasks: Tarea[]): void {
    this._tasks.set(tasks);
  }
  addTask(task: Tarea): void {
    this._tasks.update(tasks => [...tasks, task]);
  }
  updateTask(id: string, updates: Partial<Tarea>): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }
  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }
  deleteSelectedTasks(): void {
    const selected = this._selectedTasks();
    this._tasks.update(tasks =>
      tasks.filter(task => !selected.includes(task.id))
    );
    this._selectedTasks.set([]);
  }
  toggleTask(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completada: !task.completada } : task
      )
    );
  }
  markAllComplete(): void {
    this._tasks.update(tasks =>
      tasks.map(task => ({ ...task, completada: true }))
    );
  }
  clearCompleted(): void {
    this._tasks.update(tasks => tasks.filter(task => !task.completada));
  }
  setFilter(filter: Partial<TaskFilter>): void {
    this._filter.update(current => ({ ...current, ...filter }));
  }
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }
  toggleTaskSelection(taskId: string): void {
    this._selectedTasks.update(selected => {
      const isSelected = selected.includes(taskId);
      return isSelected
        ? selected.filter(id => id !== taskId)
        : [...selected, taskId];
    });
  }
  selectAllTasks(): void {
    const allTaskIds = this.filteredTasks().map(task => task.id);
    this._selectedTasks.set(allTaskIds);
  }
  clearSelection(): void {
    this._selectedTasks.set([]);
  }
  moveTask(fromIndex: number, toIndex: number): void {
    this._tasks.update(tasks => {
      const result = [...tasks];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }
  getTaskById(id: string): Tarea | undefined {
    return this.tasks().find(task => task.id === id);
  }
  removeTask(id: string): void {
    this.deleteTask(id);
  }
  statistics = computed(() => {
    const tasks = this.tasks();
    const now = new Date();
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completada).length,
      pending: tasks.filter(t => !t.completada).length,
      overdue: tasks.filter(t =>
        !t.completada &&
        t.fechaLimite &&
        t.fechaLimite < now
      ).length,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      averageCompletionTime: 0,
      productivityScore: 0
    };
    tasks.forEach(task => {
      stats.byCategory[task.categoria] = (stats.byCategory[task.categoria] || 0) + 1;
    });
    tasks.forEach(task => {
      stats.byPriority[task.prioridad] = (stats.byPriority[task.prioridad] || 0) + 1;
    });
    const completedTasks = tasks.filter(t => t.completada && t.fechaCompletada);
    if (completedTasks.length > 0) {
      const totalDays = completedTasks.reduce((sum, task) => {
        const created = task.fechaCreacion.getTime();
        const completed = task.fechaCompletada!.getTime();
        return sum + Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
      }, 0);
      stats.averageCompletionTime = Math.round(totalDays / completedTasks.length);
    }
    if (stats.total > 0) {
      const priorityWeights = { urgente: 4, alta: 3, media: 2, baja: 1 };
      const completedScore = completedTasks.reduce((sum, task) =>
        sum + priorityWeights[task.prioridad], 0
      );
      const totalPossibleScore = tasks.reduce((sum, task) =>
        sum + priorityWeights[task.prioridad], 0
      );
      stats.productivityScore = totalPossibleScore > 0
        ? Math.round((completedScore / totalPossibleScore) * 100)
        : 0;
    }
    return stats;
  });
}

