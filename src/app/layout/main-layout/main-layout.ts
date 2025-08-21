import {Component, inject} from '@angular/core';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import {TopBar} from '../top-bar/top-bar';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Sidebar} from '../sidebar/sidebar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCard, MatCardHeader} from '@angular/material/card';
import {filter, map, startWith} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';


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
  private router = inject(Router);

  private getDeepestSnapshot(): ActivatedRouteSnapshot | null {
    let snap: ActivatedRouteSnapshot | null = this.router.routerState?.snapshot?.root ?? null;
    while (snap?.firstChild) snap = snap.firstChild;
    return snap;
  }

  private header$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    startWith(null),
    map(() => this.getDeepestSnapshot()?.data?.['header'] ?? 'Aplikacija')
  );

  pageHeader = toSignal(this.header$, { initialValue: 'Aplikacija' });
}
