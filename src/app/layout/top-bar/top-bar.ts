import {Component, DestroyRef, inject, signal} from '@angular/core';
import {filter, fromEvent, merge, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss'
})
export class TopBar {
  private destroyRef = inject(DestroyRef);

  // inicijalna vrednost odmah iz sessionStorage (nema OnInit)
  fullName = signal(
    sessionStorage.getItem('fullName') || sessionStorage.getItem('user') || ''
  );

  // reaktivno osvežavanje: naš custom event + (opciono) 'storage' za druge tabove
  constructor() {
    merge(
      fromEvent<StorageEvent>(window, 'storage').pipe(
        filter(e => e.key === 'fullName' || e.key === 'user')
      ),
      fromEvent(window, 'user-updated') // ti ovo već dispečuješ posle logina/refresh-a
    )
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.fullName.set(
          sessionStorage.getItem('fullName') || sessionStorage.getItem('user') || ''
        );
      });
  }
}
