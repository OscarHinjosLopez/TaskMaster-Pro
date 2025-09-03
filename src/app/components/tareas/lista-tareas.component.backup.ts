import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Compo    this.isLoading = true;
    this.cdr.markForCheck();
    effect(() => {
      const tareas = this.tareaService.getTareas$()();
      this.tareas = tareas;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  OnInit,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TareaService } from '../../services/tarea.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
  fechaCreacion: Date;
}
@Component({
  selector: 'lista-tareas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './lista-tareas.component.html',
  styleUrl: './lista-tareas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaTareasComponent implements OnInit, OnDestroy {
  private readonly tareaService = inject(TareaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  protected tareas: Tarea[] = [];
  protected isLoading = false;
  private static readonly MESSAGES = {
    TASK_DELETED: '🗑️ Tarea eliminada correctamente',
    ERROR_DELETING: '❌ Error al eliminar la tarea',
    CLOSE: 'Cerrar',
  } as const;
  ngOnInit(): void {
    this.loadTareas();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private loadTareas(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.tareaService
      .getTareas$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tareas) => {
          this.tareas = tareas;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cargar tareas:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }
  protected eliminarTarea(tarea: Tarea): void {
    try {
      this.tareaService.eliminarTarea(tarea);
      this.showSnackBar(ListaTareasComponent.MESSAGES.TASK_DELETED);
    } catch (error) {
      this.handleError(error);
    }
  }
  protected toggleTarea(tarea: Tarea): void {
    try {
      this.tareaService.toggleTarea(tarea.id);
    } catch (error) {
      this.handleError(error);
    }
  }
  protected trackByTarea(index: number, tarea: Tarea): string {
    return tarea.id;
  }
  private showSnackBar(message: string): void {
    this.snackBar.open(message, ListaTareasComponent.MESSAGES.CLOSE, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  private handleError(error: unknown): void {
    console.error('Error en lista de tareas:', error);
    this.showSnackBar(ListaTareasComponent.MESSAGES.ERROR_DELETING);
  }
}

