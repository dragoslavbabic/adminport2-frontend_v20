import { Routes } from '@angular/router';
import { Login } from './auth/login/login';           // <-- importuj klasu Login, NE MainLayout!
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './layout/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login je samostalan ekran
  { path: 'login', component: Login },

  // Svi "app" ekrani su deca MainLayout-a
  {
    path: '',
    component: MainLayout,
    // canActivate: [AuthGuard],        // <- stavi ovde ako koristiš guard
    children: [
      {
        path: 'wiki',
        loadComponent: () => import('./layout/wiki/wiki').then(m => m.Wiki),
        data: { header: 'WIKI KOD' }
      },
      {
        path: 'korisnici',
        loadComponent: () => import('./layout/dashboard/dashboard').then(m => m.Dashboard),
        data: { header: 'Pretraga korisnika' }
      },
      { path: '', pathMatch: 'full', redirectTo: 'korisnici' } // landing posle login-a
    ]
  },

  { path: '**', redirectTo: 'login' }
];

