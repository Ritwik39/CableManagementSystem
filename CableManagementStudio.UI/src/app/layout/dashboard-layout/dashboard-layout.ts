import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayoutComponent {

  sidebarCollapsed = false;

  fullName = localStorage.getItem('fullName');
  username = localStorage.getItem('username');

  constructor(
    private router: Router
  ) { }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}

