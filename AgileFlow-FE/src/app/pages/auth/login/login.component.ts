import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen surface-ground">
      <div class="surface-card p-5 border-round shadow-2 w-full" style="max-width: 400px">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-2">AgileFlow</div>
          <span class="text-600 font-medium">Inicia sesión para continuar</span>
        </div>
        <div class="flex flex-column gap-3">
          <div class="flex flex-column gap-1">
            <label class="text-900 font-medium">Email</label>
            <input pInputText [(ngModel)]="email" type="email" placeholder="admin@agileflow.com" class="w-full"/>
          </div>
          <div class="flex flex-column gap-1">
            <label class="text-900 font-medium">Contraseña</label>
            <p-password [(ngModel)]="password" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
          </div>
          <p-button label="Ingresar" [loading]="loading" (onClick)="login()" styleClass="w-full mt-2"></p-button>
          <div *ngIf="error" class="text-red-500 text-center text-sm">{{ error }}</div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error = 'Credenciales inválidas.';
        this.loading = false;
      }
    });
  }
}