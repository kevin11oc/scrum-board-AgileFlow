import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  recentProjects: Project[] = [];
  loading = false;
  userName = '';
  userEmail = '';
  totalProjects = 0;
  activeProjects = 0;
  completedProjects = 0;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.name ?? '';
    this.userEmail = user?.email ?? '';
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAll('', 1, 100).subscribe({
      next: res => {
        this.totalProjects = res.total;
        this.activeProjects = res.items.filter(p => p.status === 'active').length;
        this.completedProjects = res.items.filter(p => p.status === 'completed').length;
        this.recentProjects = res.items.slice(0, 5);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  goToBoard(projectId: string): void {
    this.router.navigate(['/board', projectId]);
  }
}
