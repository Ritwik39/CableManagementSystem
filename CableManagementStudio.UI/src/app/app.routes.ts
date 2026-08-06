import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login (UNCHANGED)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },

  // Main Application Layout
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout')
        .then(m => m.DashboardLayoutComponent),

    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customer-list/customer-list')
            .then(m => m.CustomerListComponent)
      },

      {
        path: 'packages',
        loadComponent: () =>
          import('./features/packages/package-list/package-list')
            .then(m => m.PackageListComponent)
      },

      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/payment-list/payment-list')
            .then(m => m.PaymentListComponent)
      }

    ]

  },

  {
    path: '**',
    redirectTo: 'login'
  }

];