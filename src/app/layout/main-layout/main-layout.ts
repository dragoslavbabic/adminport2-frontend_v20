import { Component } from '@angular/core';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import {TopBar} from '../top-bar/top-bar';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCard, MatCardHeader} from '@angular/material/card';


@Component({
  selector: 'app-main-layout',
  imports: [
    MatSidenavContainer,
    TopBar,
    RouterOutlet,
    Sidebar,
    MatSidenav,
    MatSidenavModule,
    MatCardHeader,
    MatCard
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
