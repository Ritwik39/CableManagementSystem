import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { DashboardService } from '../../../core/services/dashboard.service';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  // ==========================
  // Role
  // ==========================

  role = localStorage.getItem('role');
  username = localStorage.getItem('username');

  isCustomer = this.role === 'Customer';

  // ==========================
  // Common
  // ==========================

  loading = true;
  errorMessage = '';

  // ==========================
  // Admin / Employee Dashboard
  // ==========================

  totalCustomers = 0;
  totalPackages = 0;
  totalPayments = 0;

  customers: any[] = [];
  packages: any[] = [];
  payments: any[] = [];
  recentPayments: any[] = [];

  // ==========================
  // Customer Dashboard
  // ==========================

  profile: any = null;

  constructor(
    private dashboardService: DashboardService,
    private customerService: CustomerService,
  ) {}

  // ==========================
  // INIT
  // ==========================

  ngOnInit(): void {
    if (this.isCustomer) {
      this.loadCustomerDashboard();
    } else {
      this.loadAdminDashboard();
    }
  }

  // ==================================================
  // ADMIN / EMPLOYEE DASHBOARD
  // ==================================================

  loadAdminDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      customers: this.dashboardService.getCustomers(),

      packages: this.dashboardService.getPackages(),

      payments: this.dashboardService.getPayments(),
    }).subscribe({
      next: (response) => {
        this.customers = response.customers ?? [];

        this.packages = response.packages ?? [];

        this.payments = response.payments ?? [];

        // Statistics

        this.totalCustomers = this.customers.length;

        this.totalPackages = this.packages.length;

        this.totalPayments = this.payments.length;

        // Recent Payments

        this.recentPayments = [...this.payments]

          .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())

          .slice(0, 5);

        this.loading = false;
      },

      error: (error) => {
        console.error('Admin Dashboard Error:', error);

        this.errorMessage = 'Unable to load dashboard data.';

        this.loading = false;
      },
    });
  }

  // ==================================================
  // CUSTOMER DASHBOARD
  // ==================================================

  loadCustomerDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.customerService.getMyProfile().subscribe({
      next: (response) => {
        this.profile = response;

        this.loading = false;
      },

      error: (error) => {
        console.error('Customer Dashboard Error:', error);

        this.errorMessage = error.error?.message || 'Unable to load your dashboard.';

        this.loading = false;
      },
    });
  }

  // ==========================
  // REFRESH
  // ==========================

  refreshDashboard(): void {
    if (this.isCustomer) {
      this.loadCustomerDashboard();
    } else {
      this.loadAdminDashboard();
    }
  }
}
