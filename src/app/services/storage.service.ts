import { Injectable } from '@angular/core';
import { Tarea } from '../stores/task.store';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly dbName = 'TaskMasterDB';
  private readonly storeName = 'tasks';
  private readonly version = 1;
  private db: IDBDatabase | null = null;
  constructor() {
    this.initDB();
  }
  private async initDB(): Promise<void> {
    try {
      this.db = await this.openDB();
    } catch (error) {
      console.warn(
        'IndexedDB not available, using localStorage as fallback'
      );
    }
  }
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB no está disponible'));
        return;
      }
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('completada', 'completada', { unique: false });
          store.createIndex('fechaCreacion', 'fechaCreacion', {
            unique: false,
          });
          store.createIndex('categoria', 'categoria', { unique: false });
        }
      };
    });
  }
  async saveTasks(tasks: Tarea[]): Promise<void> {
    if (this.db) {
      return this.saveToIndexedDB(tasks);
    } else {
      return this.saveToLocalStorage(tasks);
    }
  }
  async getTasks(): Promise<Tarea[]> {
    if (this.db) {
      return this.getFromIndexedDB();
    } else {
      return this.getFromLocalStorage();
    }
  }
  async saveTask(task: Tarea): Promise<void> {
    if (this.db) {
      return this.saveTaskToIndexedDB(task);
    } else {
      const tasks = await this.getTasks();
      const existingIndex = tasks.findIndex((t) => t.id === task.id);
      if (existingIndex >= 0) {
        tasks[existingIndex] = task;
      } else {
        tasks.push(task);
      }
      return this.saveToLocalStorage(tasks);
    }
  }
  async deleteTask(taskId: string): Promise<void> {
    if (this.db) {
      return this.deleteFromIndexedDB(taskId);
    } else {
      const tasks = await this.getTasks();
      const filtered = tasks.filter((t) => t.id !== taskId);
      return this.saveToLocalStorage(filtered);
    }
  }
  private async saveToIndexedDB(tasks: Tarea[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });
    for (const task of tasks) {
      await new Promise<void>((resolve, reject) => {
        const addRequest = store.add({
          ...task,
          fechaCreacion: task.fechaCreacion.toISOString(),
          fechaLimite: task.fechaLimite?.toISOString(),
        });
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      });
    }
  }
  private async getFromIndexedDB(): Promise<Tarea[]> {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const tasks = request.result.map((task: any) => ({
          ...task,
          fechaCreacion: new Date(task.fechaCreacion),
          fechaLimite: task.fechaLimite
            ? new Date(task.fechaLimite)
            : undefined,
        }));
        resolve(tasks);
      };
      request.onerror = () => reject(request.error);
    });
  }
  private async saveTaskToIndexedDB(task: Tarea): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    return new Promise((resolve, reject) => {
      const taskData = {
        ...task,
        fechaCreacion: task.fechaCreacion.toISOString(),
        fechaLimite: task.fechaLimite?.toISOString(),
      };
      const request = store.put(taskData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  private async deleteFromIndexedDB(taskId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    return new Promise((resolve, reject) => {
      const request = store.delete(taskId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  private saveToLocalStorage(tasks: Tarea[]): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return Promise.resolve();
    }
    try {
      const serialized = JSON.stringify(tasks, (key, value) => {
        if (key === 'fechaCreacion' || key === 'fechaLimite') {
          return value instanceof Date ? value.toISOString() : value;
        }
        return value;
      });
      localStorage.setItem('taskmaster_tasks', serialized);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  private getFromLocalStorage(): Promise<Tarea[]> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return Promise.resolve([]);
    }
    try {
      const stored = localStorage.getItem('taskmaster_tasks');
      if (!stored) return Promise.resolve([]);
      const tasks = JSON.parse(stored).map((task: any) => ({
        ...task,
        fechaCreacion: new Date(task.fechaCreacion),
        fechaLimite: task.fechaLimite ? new Date(task.fechaLimite) : undefined,
      }));
      return Promise.resolve(tasks);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return Promise.resolve([]);
    }
  }
  async exportTasks(): Promise<string> {
    const tasks = await this.getTasks();
    return JSON.stringify(tasks, null, 2);
  }
  async importTasks(jsonData: string): Promise<void> {
    try {
      const tasks = JSON.parse(jsonData).map((task: any) => ({
        ...task,
        fechaCreacion: new Date(task.fechaCreacion),
        fechaLimite: task.fechaLimite ? new Date(task.fechaLimite) : undefined,
      }));
      await this.saveTasks(tasks);
    } catch (error) {
      throw new Error('Formato de datos inválido');
    }
  }
  async clearAllData(): Promise<void> {
    if (this.db) {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('taskmaster_tasks');
      }
    }
  }
  async setItem<T>(key: string, value: T): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return;
    }
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`taskmaster_${key}`, serialized);
    } catch (error) {
      throw new Error(`Error saving ${key}: ${error}`);
    }
  }
  async getItem<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      const item = localStorage.getItem(`taskmaster_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error loading ${key}:`, error);
      return null;
    }
  }
  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    localStorage.removeItem(`taskmaster_${key}`);
  }
  async hasItem(key: string): Promise<boolean> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    return localStorage.getItem(`taskmaster_${key}`) !== null;
  }
  async getAllKeys(): Promise<string[]> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('taskmaster_')) {
        keys.push(key.replace('taskmaster_', ''));
      }
    }
    return keys;
  }
  async getStorageInfo(): Promise<{
    used: number;
    available: number;
    keys: string[];
  }> {
    let used = 0;
    const keys = await this.getAllKeys();
    for (const key of keys) {
      const item = localStorage.getItem(`taskmaster_${key}`);
      if (item) {
        used += item.length;
      }
    }
    const estimated = 5 * 1024 * 1024;
    return {
      used,
      available: Math.max(0, estimated - used),
      keys,
    };
  }
}

