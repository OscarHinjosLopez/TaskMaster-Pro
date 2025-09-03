import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../stores/task.store';
import { AgregarTareasComponent } from '../../components/agregar-tareas/agregar-tareas.component';
import { ListaTareasComponent } from '../../components/tareas/lista-tareas.component';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AgregarTareasComponent,
    ListaTareasComponent,
    LanguageSelectorComponent,
    TranslatePipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly tareaService = inject(TareaService);
  protected totalTareas = 0;
  protected tareasCompletadas = 0;
  protected tareasPendientes = 0;
  protected isGridView = true;
  protected isFabMenuOpen = false;
  protected currentYear = new Date().getFullYear();
  private readonly taskWatcher = effect(() => {
    const tareas = this.tareaService.getTareas$()();
    this.totalTareas = tareas.length;
    this.tareasCompletadas = tareas.filter((t: Tarea) => t.completada).length;
    this.tareasPendientes = this.totalTareas - this.tareasCompletadas;
  });
  ngOnInit(): void {
    this.updateStats();
  }
  private updateStats(): void {
    const tareas = this.tareaService.obtenerTareas();
    this.totalTareas = tareas.length;
    this.tareasCompletadas = tareas.filter((t: Tarea) => t.completada).length;
    this.tareasPendientes = this.totalTareas - this.tareasCompletadas;
  }
  protected toggleView(): void {
    this.isGridView = !this.isGridView;
  }
  protected refreshTasks(): void {
    this.updateStats();
  }
  protected toggleFabMenu(): void {
    this.isFabMenuOpen = !this.isFabMenuOpen;
  }
  protected quickAddTask(): void {
    document.querySelector('app-agregar-tareas')?.scrollIntoView({
      behavior: 'smooth',
    });
    this.isFabMenuOpen = false;
  }
  protected markAllComplete(): void {
    const tareas = this.tareaService.obtenerTareas();
    tareas
      .filter((t: Tarea) => !t.completada)
      .forEach((t: Tarea) => {
        this.tareaService.completarTarea(t.id);
      });
    this.isFabMenuOpen = false;
  }
  protected clearCompleted(): void {
    const tareas = this.tareaService.obtenerTareas();
    tareas
      .filter((t: Tarea) => t.completada)
      .forEach((t: Tarea) => {
        this.tareaService.eliminarTarea(t.id);
      });
    this.isFabMenuOpen = false;
  }
}

