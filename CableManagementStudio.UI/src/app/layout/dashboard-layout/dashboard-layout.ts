import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [Sidebar, Header, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
