import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./features/login/login').then((mod) => mod.Login),
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import('./features/register/register').then((mod) => mod.Register),
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((mod) => mod.Dashboard),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/company/company').then((mod) => mod.Company),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients').then((mod) => mod.Clients),
      },
      {
        path: 'quotes',
        loadComponent: () =>
          import('./features/quotes/quotes').then((mod) => mod.Quotes),
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./features/invoices/invoices').then((mod) => mod.Invoices),
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
