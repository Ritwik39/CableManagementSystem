import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard')
        .then(m => m.DashboardComponent)
  },

  {
  path: 'dashboard',
  loadComponent: () =>
    import('./features/dashboard/dashboard/dashboard')
      .then(m => m.DashboardComponent)
},
{
  path: 'customers',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/customers/customer-list/customer-list')
      .then(m => m.CustomerListComponent)
},
{
  path: 'packages',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/packages/package-list/package-list')
      .then(m => m.PackageListComponent)
},
{
  path: 'payments',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/payments/payment-list/payment-list')
      .then(m => m.PaymentListComponent)
}

];