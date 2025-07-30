import { Routes } from '@angular/router';
import { Login } from './auth/login/login';           // <-- importuj klasu Login, NE MainLayout!
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './layout/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then(m => m.LayoutModule)
  },
  { path: '**', redirectTo: 'login' }
];

