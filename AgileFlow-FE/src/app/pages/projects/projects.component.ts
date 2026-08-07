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
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
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
