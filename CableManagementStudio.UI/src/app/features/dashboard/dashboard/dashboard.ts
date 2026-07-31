import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  dashboard: any;

  loading = true;

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.dashboardService.getDashboard().subscribe({

      next: (response: any) => {

        this.dashboard = response;
        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

}