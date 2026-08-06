import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnService } from '../../core/services/column.service';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { Column } from '../../core/models/column.model';
import { Task } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';
import { SignalRService } from '../../core/services/signalr.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, DialogModule,
    InputTextModule, DropdownModule, ToastModule, ConfirmDialogModule, TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex align-items-center justify-content-between mb-4">
        <div class="flex align-items-center gap-3">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-text" (onClick)="goBack()"></p-button>
          <h2 class="m-0">{{ project?.name }}</h2>
        </div>
        <div class="flex align-items-center gap-2">
          <p-button label="PDF" icon="pi pi-file-pdf" styleClass="p-button-danger p-button-outlined"
            (onClick)="downloadReport('pdf')"></p-button>
          <p-button label="Excel" icon="pi pi-file-excel" styleClass="p-button-success p-button-outlined"
            (onClick)="downloadReport('excel')"></p-button>
          <p-button label="Nueva Columna" icon="pi pi-plus" (onClick)="openNewColumn()"></p-button>
        </div>

      </div>

      <div class="flex gap-3 overflow-x-auto pb-3"
           (dragover)="onBoardDragOver($event)"
           (drop)="onBoardDrop($event)">

        <div *ngFor="let column of columns"
             class="kanban-column border-round surface-card p-3"
             style="min-width: 280px; max-width: 280px"
             [attr.data-column-id]="column.id"
             (dragover)="onColumnDragOver($event, column)"
             (drop)="onColumnDrop($event, column)">

          <div class="flex align-items-center justify-content-between mb-3">
            <span class="font-semibold text-900">{{ column.name }}</span>
            <div class="flex gap-1">
              <p-button icon="pi pi-pencil" styleClass="p-button-text p-button-sm p-button-rounded"
                (onClick)="editColumn(column)"></p-button>
              <p-button icon="pi pi-trash" styleClass="p-button-text p-button-sm p-button-rounded p-button-danger"
                (onClick)="confirmDeleteColumn(column)"></p-button>
            </div>
          </div>

          <div class="flex flex-column gap-2 mb-3" style="min-height: 100px">
            <div *ngFor="let task of getTasksByColumn(column.id)"
                 class="kanban-task surface-ground border-round p-3 cursor-pointer"
                 draggable="true"
                 [attr.data-task-id]="task.id"
                 (dragstart)="onTaskDragStart($event, task)"
                 (dragend)="onTaskDragEnd()">

              <div class="flex justify-content-between align-items-start mb-2">
                <span class="font-medium text-900 text-sm">{{ task.title }}</span>
                <div class="flex gap-1">
                  <p-button icon="pi pi-pencil" styleClass="p-button-text p-button-sm p-button-rounded"
                    (onClick)="editTask(task)"></p-button>
                  <p-button icon="pi pi-trash" styleClass="p-button-text p-button-sm p-button-rounded p-button-danger"
                    (onClick)="confirmDeleteTask(task)"></p-button>
                </div>
              </div>

              <p *ngIf="task.description" class="text-600 text-xs m-0 mb-2">{{ task.description }}</p>

              <div class="flex align-items-center justify-content-between">
                <span class="text-xs border-round px-2 py-1"
                  [ngClass]="{
                    'bg-red-100 text-red-700': task.priority === 'high',
                    'bg-yellow-100 text-yellow-700': task.priority === 'medium',
                    'bg-green-100 text-green-700': task.priority === 'low'
                  }">
                  {{ task.priority }}
                </span>
                <span *ngIf="task.assigneeName" class="text-xs text-600">{{ task.assigneeName }}</span>
              </div>
            </div>
          </div>

          <p-button label="+ Tarea" styleClass="p-button-text p-button-sm w-full"
            (onClick)="openNewTask(column)"></p-button>
        </div>

        <div *ngIf="columns.length === 0 && !loading" class="text-600 p-4">
          No hay columnas. Crea una para empezar.
        </div>
      </div>
    </div>

    <!-- Dialog Columna -->
    <p-dialog [(visible)]="columnDialogVisible"
      [header]="columnEditMode ? 'Editar Columna' : 'Nueva Columna'"
      [modal]="true" [style]="{width: '400px'}">
      <div class="flex flex-column gap-2 pt-2">
        <label>Nombre *</label>
        <input pInputText [(ngModel)]="columnForm.name" class="w-full"/>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" styleClass="p-button-text" (onClick)="columnDialogVisible = false"></p-button>
        <p-button label="Guardar" [loading]="saving" (onClick)="saveColumn()"></p-button>
      </ng-template>
    </p-dialog>

    <!-- Dialog Tarea -->
    <p-dialog [(visible)]="taskDialogVisible"
      [header]="taskEditMode ? 'Editar Tarea' : 'Nueva Tarea'"
      [modal]="true" [style]="{width: '500px'}">
      <div class="flex flex-column gap-3 pt-2">
        <div class="flex flex-column gap-1">
          <label>Título *</label>
          <input pInputText [(ngModel)]="taskForm.title" class="w-full"/>
        </div>
        <div class="flex flex-column gap-1">
          <label>Descripción</label>
          <input pInputText [(ngModel)]="taskForm.description" class="w-full"/>
        </div>
        <div class="flex flex-column gap-1">
          <label>Prioridad</label>
          <p-dropdown [(ngModel)]="taskForm.priority" [options]="priorityOptions"
            optionLabel="label" optionValue="value" styleClass="w-full"></p-dropdown>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" styleClass="p-button-text" (onClick)="taskDialogVisible = false"></p-button>
        <p-button label="Guardar" [loading]="saving" (onClick)="saveTask()"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .kanban-column { border: 1px solid var(--surface-border); }
    .kanban-task { border: 1px solid var(--surface-border); transition: box-shadow 0.2s; }
    .kanban-task:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .kanban-task[draggable="true"] { cursor: grab; }
    .drag-over { border: 2px dashed var(--primary-color) !important; }
  `]
})
export class BoardComponent implements OnInit, OnDestroy {
  projectId = '';
  project: Project | null = null;
  columns: Column[] = [];
  tasks: Task[] = [];
  loading = false;
  saving = false;

  // Drag state
  draggedTask: Task | null = null;

  // Column dialog
  columnDialogVisible = false;
  columnEditMode = false;
  selectedColumnId = '';
  columnForm = { name: '' };

  // Task dialog
  taskDialogVisible = false;
  taskEditMode = false;
  selectedTaskId = '';
  selectedColumnForTask = '';
  taskForm = { title: '', description: '', priority: 'medium' };

  priorityOptions = [
    { label: 'Alta', value: 'high' },
    { label: 'Media', value: 'medium' },
    { label: 'Baja', value: 'low' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private columnService: ColumnService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private signalRService: SignalRService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.loadBoard();
    this.connectSignalR();
  }

  connectSignalR(): void {
    this.signalRService.startConnection();

    this.signalRService.hubConnection?.onclose(() => { });

    setTimeout(() => {
      this.signalRService.joinBoard(this.projectId);
    }, 1000);

    this.signalRService.taskCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(task => {
        if (!this.tasks.find(t => t.id === task.id)) {
          this.tasks = [...this.tasks, task];
        }
      });

    this.signalRService.taskUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(task => {
        this.tasks = this.tasks.map(t => t.id === task.id ? task : t);
      });

    this.signalRService.taskDeleted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.tasks = this.tasks.filter(t => t.id !== id);
      });

    this.signalRService.taskMoved$
      .pipe(takeUntil(this.destroy$))
      .subscribe(task => {
        this.tasks = this.tasks.map(t => t.id === task.id ? task : t);
      });

    this.signalRService.columnCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(col => {
        if (!this.columns.find(c => c.id === col.id)) {
          this.columns = [...this.columns, col].sort((a, b) => a.order - b.order);
        }
      });

    this.signalRService.columnUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(col => {
        this.columns = this.columns.map(c => c.id === col.id ? col : c);
      });

    this.signalRService.columnDeleted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.columns = this.columns.filter(c => c.id !== id);
        this.tasks = this.tasks.filter(t => t.columnId !== id);
      });
  }

  ngOnDestroy(): void {
    this.signalRService.leaveBoard(this.projectId);
    this.signalRService.stopConnection();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBoard(): void {
    this.loading = true;
    this.projectService.getAll('', 1, 100).subscribe(res => {
      this.project = res.items.find(p => p.id === this.projectId) ?? null;
    });

    this.columnService.getAll(this.projectId).subscribe(columns => {
      this.columns = columns;
      this.taskService.getAll(this.projectId).subscribe(tasks => {
        this.tasks = tasks;
        this.loading = false;
      });
    });
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.tasks
      .filter(t => t.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  // ── Drag & Drop ──────────────────────────────────────

  onTaskDragStart(event: DragEvent, task: Task): void {
    this.draggedTask = task;
    event.dataTransfer?.setData('taskId', task.id);
    (event.target as HTMLElement).style.opacity = '0.5';
  }

  onTaskDragEnd(): void {
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    document.querySelectorAll('.kanban-task').forEach(el => (el as HTMLElement).style.opacity = '1');
  }

  onColumnDragOver(event: DragEvent, column: Column): void {
    event.preventDefault();
    const el = (event.currentTarget as HTMLElement);
    el.classList.add('drag-over');
  }

  onBoardDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onColumnDrop(event: DragEvent, targetColumn: Column): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.remove('drag-over');

    if (!this.draggedTask) return;
    if (this.draggedTask.columnId === targetColumn.id) return;

    const tasksInTarget = this.getTasksByColumn(targetColumn.id);
    const newOrder = tasksInTarget.length + 1;

    // Optimistic update
    const originalColumnId = this.draggedTask.columnId;
    const originalOrder = this.draggedTask.order;
    this.draggedTask.columnId = targetColumn.id;
    this.draggedTask.order = newOrder;

    this.taskService.move(this.projectId, this.draggedTask.id, {
      newColumnId: targetColumn.id,
      newOrder
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Tarea movida', detail: '' });
      },
      error: () => {
        // Revert
        this.draggedTask!.columnId = originalColumnId;
        this.draggedTask!.order = originalOrder;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo mover la tarea.' });
      }
    });

    this.draggedTask = null;
  }

  onBoardDrop(event: DragEvent): void {
    event.preventDefault();
  }

  // ── Columnas ─────────────────────────────────────────

  openNewColumn(): void {
    this.columnForm = { name: '' };
    this.columnEditMode = false;
    this.columnDialogVisible = true;
  }

  editColumn(column: Column): void {
    this.selectedColumnId = column.id;
    this.columnForm = { name: column.name };
    this.columnEditMode = true;
    this.columnDialogVisible = true;
  }

  saveColumn(): void {
    if (!this.columnForm.name) return;
    this.saving = true;

    const request$ = this.columnEditMode
      ? this.columnService.update(this.projectId, this.selectedColumnId, { name: this.columnForm.name })
      : this.columnService.create(this.projectId, { name: this.columnForm.name, projectId: this.projectId });

    request$.subscribe({
      next: () => {
        this.columnDialogVisible = false;
        this.saving = false;
        this.loadBoard();
      },
      error: () => { this.saving = false; }
    });
  }

  confirmDeleteColumn(column: Column): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la columna "${column.name}"?`,
      accept: () => {
        this.columnService.delete(this.projectId, column.id).subscribe({
          next: () => this.loadBoard(),
          error: (err) => {
            const msg = err.error?.message ?? 'No se pudo eliminar.';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
          }
        });
      }
    });
  }

  // ── Tareas ────────────────────────────────────────────

  openNewTask(column: Column): void {
    this.selectedColumnForTask = column.id;
    this.taskForm = { title: '', description: '', priority: 'medium' };
    this.taskEditMode = false;
    this.taskDialogVisible = true;
  }

  editTask(task: Task): void {
    this.selectedTaskId = task.id;
    this.selectedColumnForTask = task.columnId;
    this.taskForm = { title: task.title, description: task.description, priority: task.priority };
    this.taskEditMode = true;
    this.taskDialogVisible = true;
  }

  saveTask(): void {
    if (!this.taskForm.title) return;
    this.saving = true;

    const request$ = this.taskEditMode
      ? this.taskService.update(this.projectId, this.selectedTaskId, {
        title: this.taskForm.title,
        description: this.taskForm.description,
        priority: this.taskForm.priority
      })
      : this.taskService.create(this.projectId, {
        title: this.taskForm.title,
        description: this.taskForm.description,
        priority: this.taskForm.priority,
        columnId: this.selectedColumnForTask
      });

    request$.subscribe({
      next: () => {
        this.taskDialogVisible = false;
        this.saving = false;
        this.loadBoard();
      },
      error: () => { this.saving = false; }
    });
  }

  confirmDeleteTask(task: Task): void {
    this.confirmationService.confirm({
      message: `¿Eliminar la tarea "${task.title}"?`,
      accept: () => {
        this.taskService.delete(this.projectId, task.id).subscribe({
          next: () => this.loadBoard()
        });
      }
    });
  }

  downloadReport(format: 'pdf' | 'excel'): void {
    this.reportService.download(this.projectId, format).subscribe({
      next: (blob) => {
        const ext = format === 'pdf' ? 'pdf' : 'xlsx';
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${this.projectId}.${ext}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el reporte.' });
      }
    });
  }
}
