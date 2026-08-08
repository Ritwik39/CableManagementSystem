import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Login
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },

  // Main Application Layout
  {
    path: '',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayoutComponent),

    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard').then((m) => m.DashboardComponent),
      },

      // Customers
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customer-list/customer-list').then(
            (m) => m.CustomerListComponent,
          ),
      },
      {
        path: 'customers/add',
        loadComponent: () =>
          import('./features/customers/customer-add/customer-add').then(
            (m) => m.CustomerAddComponent,
          ),
      },
      {
        path: 'customers/edit/:id',
        loadComponent: () =>
          import('./features/customers/customer-edit/customer-edit').then((m) => m.CustomerEdit),
      },

      {
        path: 'my-profile',
        loadComponent: () =>
          import('./features/customers/my-profile/my-profile').then((m) => m.MyProfileComponent),
      },

      // Add Package
      {
        path: 'packages/add',
        loadComponent: () =>
          import('./features/packages/package-add/package-add').then((m) => m.PackageAdd),
      },

      // Edit Package
      {
        path: 'packages/edit/:id',
        loadComponent: () =>
          import('./features/packages/package-edit/package-edit').then((m) => m.PackageEdit),
      },

      // Package List
      {
        path: 'packages',
        loadComponent: () =>
          import('./features/packages/package-list/package-list').then((m) => m.PackageList),
      },

      // Payments
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/payment-list/payment-list').then(
            (m) => m.PaymentListComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
