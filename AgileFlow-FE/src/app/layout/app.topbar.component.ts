import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  userName = '';

  constructor(public layoutService: LayoutService, private authService: AuthService) {
    const user = this.authService.getUser();
    this.userName = user?.name ?? '';
  }

  logout(): void {
    this.authService.logout();
  }
}
