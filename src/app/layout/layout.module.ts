import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { MainLayout } from './main-layout/main-layout';
import { Dashboard } from './dashboard/dashboard';
import { Wiki } from './wiki/wiki';

@NgModule({
  declarations: [

    // ... ostale komponente iza login-a
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MainLayout,
    Dashboard,
    Wiki,
  ]
})
export class LayoutModule { }
