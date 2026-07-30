import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            // {
            //     path: 'dashboard',
            //     loadComponent: () =>
            //         import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            // }
        ]
    },
    // {
    //     path: 'auth',
    //     loadComponent: () =>
    //         import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    // },
    { path: '**', redirectTo: '' }
];