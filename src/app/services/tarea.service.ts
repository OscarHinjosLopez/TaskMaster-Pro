import { Injectable, inject, effect } from '@angular/core';
import { TaskStore, Tarea } from '../stores/task.store';
import { StorageService } from './storage.service';
import { TranslationService } from './translation.service';
export type Categoria =
  | 'personal'
  | 'trabajo'
  | 'estudio'
  | 'hogar'
  | 'salud'
  | 'finanzas'
  | 'social';
export type Prioridad = 'baja' | 'media' | 'alta' | 'urgente';
@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private readonly taskStore = inject(TaskStore);
  private readonly storageService = inject(StorageService);
  private readonly translationService = inject(TranslationService);
  constructor() {
    this.loadTasks();
    this.setupAutoSave();
  }
  private async loadTasks(): Promise<void> {
    try {
      const tasks = await this.storageService.getTasks();
      this.taskStore.setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }
  private setupAutoSave(): void {
    effect(() => {
      const tasks = this.taskStore.tasks();
      if (tasks.length > 0) {
        this.storageService.saveTasks(tasks).catch((error) => {
          console.warn('Auto-save failed:', error);
        });
      }
    });
  }
  async agregarTarea(
    titulo: string,
    descripcion: string = '',
    categoria: Categoria = 'personal',
    prioridad: Prioridad = 'media',
    fechaLimite?: Date
  ): Promise<Tarea> {
    try {
      const nuevaTarea: Tarea = {
        id: this.generateId(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        completada: false,
        fechaCreacion: new Date(),
        fechaLimite,
        categoria,
        prioridad,
        subtareas: [],
        etiquetas: [],
        tiempoEstimado: 0,
        tiempoReal: 0,
        recordatorios: [],
        comentarios: [],
        archivosAdjuntos: [],
      };
      this.taskStore.addTask(nuevaTarea);
      return nuevaTarea;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }
  async completarTarea(id: string): Promise<void> {
    try {
      const task = this.taskStore.getTaskById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      this.taskStore.updateTask(id, { completada: !task.completada });
      const message = task.completada
        ? 'Task "${task.titulo}" uncompleted'
        : 'Task "${task.titulo}" completed';
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
  async eliminarTarea(id: string): Promise<void> {
    try {
      const task = this.taskStore.getTaskById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      this.taskStore.removeTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
  async actualizarTarea(tarea: Tarea): Promise<void> {
    try {
      this.taskStore.updateTask(tarea.id, tarea);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
  obtenerTareas() {
    return this.taskStore.tasks();
  }
  obtenerTareasPorCategoria(categoria: Categoria) {
    return this.taskStore.tasks().filter((t) => t.categoria === categoria);
  }
  obtenerTareasCompletadas() {
    return this.taskStore.tasks().filter((t) => t.completada);
  }
  obtenerTareasPendientes() {
    return this.taskStore.tasks().filter((t) => !t.completada);
  }
  getTareas$() {
    return this.taskStore.tasks;
  }
  setFilter(filter: any) {
    this.taskStore.setFilter(filter);
  }
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
