import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  loading = true;

  totalCustomers = 0;
  totalPackages = 0;
  totalPayments = 0;

  customers: any[] = [];
  packages: any[] = [];
  payments: any[] = [];
  recentPayments: any[] = [];

  errorMessage = '';

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;

    forkJoin({

      customers: this.dashboardService.getCustomers(),

      packages: this.dashboardService.getPackages(),

      payments: this.dashboardService.getPayments()

    }).subscribe({

      next: (response) => {

        this.customers = response.customers ?? [];
        this.packages = response.packages ?? [];
        this.payments = response.payments ?? [];

        this.totalCustomers = this.customers.length;
        this.totalPackages = this.packages.length;
        this.totalPayments = this.payments.length;

        this.recentPayments = [...this.payments]
          .sort((a, b) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime())
          .slice(0, 5);

        this.loading = false;

      },

      error: (error) => {

        console.error(error);

        this.errorMessage = 'Unable to load dashboard data.';

        this.loading = false;

      }

    });

  }

  refreshDashboard(): void {
    this.loadDashboard();
  }

}