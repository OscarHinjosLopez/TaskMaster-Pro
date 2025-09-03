import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../stores/task.store';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '../../pipes/translate.pipe';
interface SnackBarConfig {
  readonly duration: number;
  readonly horizontalPosition: 'center';
  readonly verticalPosition: 'top';
  readonly panelClass: string[];
}
@Component({
  selector: 'agregar-tareas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './agregar-tareas.component.html',
  styleUrl: './agregar-tareas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarTareasComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly tareaService = inject(TareaService);
  private static readonly SNACKBAR_CONFIG: SnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: [],
  } as const;
  private static readonly MESSAGES = {
    TASK_EXISTS: '⚠️ La tarea ya existe',
    TASK_ADDED: '✅ Tarea agregada correctamente',
    ERROR_ADDING: '❌ Error al agregar la tarea',
    CLOSE: 'Cerrar',
    REQUIRED: 'La tarea es requerida',
    MIN_LENGTH: 'La tarea debe tener al menos 3 caracteres',
  } as const;
  protected readonly tareaForm = this.fb.group({
    tarea: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });
  protected isLoading = false;
  ngOnInit(): void {
  }
  protected get tareaControl(): FormControl<string> {
    return this.tareaForm.controls.tarea;
  }
  protected get isTareaInvalid(): boolean {
    return this.tareaControl.invalid && this.tareaControl.touched;
  }
  protected get tareaErrorMessage(): string {
    if (this.tareaControl.hasError('required')) {
      return AgregarTareasComponent.MESSAGES.REQUIRED;
    }
    if (this.tareaControl.hasError('minlength')) {
      return AgregarTareasComponent.MESSAGES.MIN_LENGTH;
    }
    return '';
  }
  protected clearForm(): void {
    this.tareaForm.reset();
    this.tareaForm.get('tarea')?.markAsUntouched();
  }
  protected async onSubmit(): Promise<void> {
    if (!this.tareaForm.valid) {
      this.markFormGroupTouched();
      return;
    }
    const tareaValue = this.tareaForm.value.tarea?.trim();
    if (!tareaValue) return;
    this.isLoading = true;
    try {
      const tareasActuales = this.tareaService.obtenerTareas();
      if (
        tareasActuales.some(
          (t: Tarea) =>
            (t.titulo || t.texto || '').toLowerCase() ===
            tareaValue.toLowerCase()
        )
      ) {
        this.showSnackBar(
          AgregarTareasComponent.MESSAGES.TASK_EXISTS,
          'warning-snackbar'
        );
        this.isLoading = false;
        return;
      }
      await this.tareaService.agregarTarea(
        tareaValue, // titulo
        '', // descripcion
        'personal', // categoria
        'media' // prioridad
      );
      this.showSnackBar(
        AgregarTareasComponent.MESSAGES.TASK_ADDED,
        'success-snackbar'
      );
      this.tareaForm.reset();
      this.tareaForm.get('tarea')?.markAsUntouched();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }
  private markFormGroupTouched(): void {
    Object.keys(this.tareaForm.controls).forEach((key) => {
      this.tareaForm.get(key)?.markAsTouched();
    });
  }
  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, AgregarTareasComponent.MESSAGES.CLOSE, {
      ...AgregarTareasComponent.SNACKBAR_CONFIG,
      panelClass: [panelClass],
    });
  }
  private handleError(error: unknown): void {
    console.error('Error al agregar tarea:', error);
    this.showSnackBar(
      AgregarTareasComponent.MESSAGES.ERROR_ADDING,
      'error-snackbar'
    );
  }
}

