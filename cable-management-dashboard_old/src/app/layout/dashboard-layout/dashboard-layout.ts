import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { HeaderComponent } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true, // <-- Eta add koro
  imports: [Sidebar, HeaderComponent, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
