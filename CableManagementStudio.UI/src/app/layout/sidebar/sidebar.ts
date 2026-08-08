import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  // Add the missing properties used in your HTML template:
  sidebarCollapsed: boolean = false;
  role: string = 'Customer';

  // (Optional) Method to toggle the collapse state:
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
