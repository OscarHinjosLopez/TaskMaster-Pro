import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  effect,
} from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../stores/task.store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
})
export class ListaTareasComponent implements OnInit {
  private readonly tareaService = inject(TareaService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translationService = inject(TranslationService);
  tareas: Tarea[] = [];
  isLoading = false;
  private readonly taskWatcher = effect(() => {
    const tasks = this.tareaService.getTareas$()();
    this.tareas = tasks;
    this.cdr.markForCheck();
  });
  ngOnInit(): void {
    this.loadTasks();
  }
  private loadTasks(): void {
    this.isLoading = true;
    this.tareas = this.tareaService.obtenerTareas();
    this.isLoading = false;
    this.cdr.markForCheck();
  }
  completarTarea(id: string): void {
    this.tareaService.completarTarea(id);
  }
  eliminarTarea(id: string): void {
    this.tareaService.eliminarTarea(id);
  }
  getTaskText(tarea: Tarea): string {
    return (
      tarea.titulo ||
      tarea.texto ||
      this.translationService.translate('no-title')
    );
  }
  getDeleteAriaLabel(tarea: Tarea): string {
    const deleteText = this.translationService.translate('delete-task-aria');
    return `${deleteText}: ${this.getTaskText(tarea)}`;
  }
  getTaskCountText(count: number): string {
    if (count === 1) {
      return this.translationService.translate('one-task-pending');
    } else {
      const multipleText = this.translationService.translate(
        'multiple-tasks-pending'
      );
      return multipleText.replace('{count}', count.toString());
    }
  }
  trackByFn(index: number, tarea: Tarea): string {
    return tarea.id;
  }
  trackByTarea(index: number, tarea: Tarea): string {
    return tarea.id;
  }
  toggleTarea(tarea: Tarea): void {
    this.tareaService.completarTarea(tarea.id);
  }
}

