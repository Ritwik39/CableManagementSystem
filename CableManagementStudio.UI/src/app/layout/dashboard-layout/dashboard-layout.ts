import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayoutComponent {
  sidebarCollapsed = false;

  fullName = localStorage.getItem('fullName');
  username = localStorage.getItem('username');
  role = localStorage.getItem('role');

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    console.log('Logout button clicked');

    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout API successful:', response);

        localStorage.clear();

        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Logout API failed:', error);

        // Even if API fails, clear local session
        localStorage.clear();

        this.router.navigate(['/login']);
      },
    });
  }
}
