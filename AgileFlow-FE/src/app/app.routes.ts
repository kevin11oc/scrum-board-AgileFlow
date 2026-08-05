import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'board/:projectId',
        loadComponent: () =>
          import('./pages/board/board.component').then(m => m.BoardComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: '' }
];
