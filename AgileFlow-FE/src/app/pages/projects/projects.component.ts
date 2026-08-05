import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProjectService } from '../../core/services/project.service';
import { Project, CreateProjectRequest } from '../../core/models/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule,
    TableModule, DialogModule, ConfirmDialogModule, ToastModule,
    DropdownModule, CalendarModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="card">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="m-0">Proyectos</h2>
        <p-button label="Nuevo Proyecto" icon="pi pi-plus" (onClick)="openNew()"></p-button>
      </div>

      <div class="mb-3">
        <input pInputText [(ngModel)]="search" placeholder="Buscar por nombre..."
          (input)="onSearch()" class="w-full"/>
      </div>

      <p-table [value]="projects" [loading]="loading" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-project>
          <tr>
            <td>{{ project.name }}</td>
            <td>{{ project.description }}</td>
            <td>{{ project.status }}</td>
            <td>{{ project.startDate | date:'dd/MM/yyyy' }}</td>
            <td>{{ project.endDate | date:'dd/MM/yyyy' }}</td>
            <td>
              <p-button icon="pi pi-pencil" styleClass="p-button-text p-button-sm"
                (onClick)="editProject(project)"></p-button>
              <p-button icon="pi pi-trash" styleClass="p-button-text p-button-sm p-button-danger"
                (onClick)="confirmDelete(project)"></p-button>
              <p-button icon="pi pi-th-large" styleClass="p-button-text p-button-sm"
                (onClick)="openBoard(project)" pTooltip="Abrir tablero"></p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="6" class="text-center">No hay proyectos.</td></tr>
        </ng-template>
      </p-table>

      <div class="flex justify-content-end mt-3">
        <p-button icon="pi pi-chevron-left" [disabled]="page === 1" (onClick)="prevPage()" styleClass="p-button-text"></p-button>
        <span class="mx-3 flex align-items-center">Página {{ page }}</span>
        <p-button icon="pi pi-chevron-right" [disabled]="projects.length < pageSize" (onClick)="nextPage()" styleClass="p-button-text"></p-button>
      </div>
    </div>

    <p-dialog [(visible)]="dialogVisible" [header]="editMode ? 'Editar Proyecto' : 'Nuevo Proyecto'"
      [modal]="true" [style]="{width: '500px'}">
      <div class="flex flex-column gap-3 pt-2">
        <div class="flex flex-column gap-1">
          <label>Nombre *</label>
          <input pInputText [(ngModel)]="form.name" class="w-full"/>
        </div>
        <div class="flex flex-column gap-1">
          <label>Descripción</label>
          <input pInputText [(ngModel)]="form.description" class="w-full"/>
        </div>
        <div class="flex flex-column gap-1">
          <label>Estado</label>
          <p-dropdown [(ngModel)]="form.status" [options]="statusOptions"
            optionLabel="label" optionValue="value" styleClass="w-full"></p-dropdown>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-1 w-full">
            <label>Fecha Inicio</label>
            <p-calendar [(ngModel)]="form.startDate" dateFormat="dd/mm/yy" styleClass="w-full"></p-calendar>
          </div>
          <div class="flex flex-column gap-1 w-full">
            <label>Fecha Fin</label>
            <p-calendar [(ngModel)]="form.endDate" dateFormat="dd/mm/yy" styleClass="w-full"></p-calendar>
          </div>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" styleClass="p-button-text" (onClick)="dialogVisible = false"></p-button>
        <p-button label="Guardar" [loading]="saving" (onClick)="save()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  saving = false;
  search = '';
  page = 1;
  pageSize = 10;
  dialogVisible = false;
  editMode = false;
  selectedId = '';

  form: any = this.emptyForm();

  statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
    { label: 'Completado', value: 'completed' }
  ];

  constructor(
    private projectService: ProjectService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  openBoard(project: Project): void {
    this.router.navigate(['/board', project.id]);
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAll(this.search, this.page, this.pageSize).subscribe({
      next: res => { this.projects = res.items; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadProjects();
  }

  prevPage(): void { this.page--; this.loadProjects(); }
  nextPage(): void { this.page++; this.loadProjects(); }

  openNew(): void {
    this.form = this.emptyForm();
    this.editMode = false;
    this.dialogVisible = true;
  }

  editProject(project: Project): void {
    this.selectedId = project.id;
    this.form = {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: new Date(project.startDate),
      endDate: new Date(project.endDate)
    };
    this.editMode = true;
    this.dialogVisible = true;
  }

  save(): void {
    if (!this.form.name) return;
    this.saving = true;
    const payload = {
      ...this.form,
      startDate: new Date(this.form.startDate).toISOString(),
      endDate: new Date(this.form.endDate).toISOString()
    };

    const request$ = this.editMode
      ? this.projectService.update(this.selectedId, payload)
      : this.projectService.create(payload);

    request$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyecto guardado.' });
        this.dialogVisible = false;
        this.saving = false;
        this.loadProjects();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar.' });
        this.saving = false;
      }
    });
  }

  confirmDelete(project: Project): void {
    this.confirmationService.confirm({
      message: `¿Eliminar el proyecto "${project.name}"?`,
      accept: () => {
        this.projectService.delete(project.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Proyecto eliminado.' });
            this.loadProjects();
          }
        });
      }
    });
  }

  emptyForm() {
    return { name: '', description: '', status: 'active', startDate: new Date(), endDate: new Date() };
  }
}
