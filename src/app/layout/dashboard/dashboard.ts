import {AfterViewInit, Component, ElementRef, Renderer2, signal, ViewChild} from '@angular/core';

// Standalone imports child komponenti:
import {KorisniciSearch} from './korisnici-search/korisnici-search';
import {PasswordGenerator} from './password-generator/password-generator';
import {KorisniciTable} from './korisnici-table/korisnici-table';
import {KorisniciDetails} from './korisnici-table/korisnici-details/korisnici-details';
import {KorisniciService} from './services/korisnici-service';
import {User} from './models/user.model';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {UserDTO} from './models/postgres-user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],

  imports: [
    KorisniciSearch,
    PasswordGenerator,
    KorisniciTable,
    KorisniciDetails,
    MatSidenavModule,
    MatIconModule,
    MatIconButton,
  ]
})
export class Dashboard implements AfterViewInit{
  users = signal<User[]>([]); // ← sada je tip User[]
  selectedUser = signal<User | undefined>(undefined);
  @ViewChild('dashboardRoot', { static: true }) dashboardRoot!: ElementRef<HTMLDivElement>;


  constructor(private korisniciService: KorisniciService, private renderer: Renderer2) {}
  ngAfterViewInit() {
  this.renderer.removeClass(this.dashboardRoot.nativeElement, 'panel-open');
}

  @ViewChild('pwgen') pwgen!: PasswordGenerator;

  // Poziva se kada se izvrši search
  searchInProgress = signal(false);
  searched = signal(false);
  onSearch(event: { data: string, attr: string }) {
    this.searchInProgress.set(true);   // 1. Počinje pretraga
    this.searched.set(true);
    this.korisniciService.searchUsers(event.data, event.attr).subscribe(users => {
      this.users.set(users);          // Direktno dodeljuješ korisnike
      console.log('USERS iz onSearch:', users);
      this.selectedUser.set(undefined); // Resetuješ detalje
      this.searchInProgress.set(false); // 3. Gotova pretraga
      console.log(this.searchInProgress(), this.searched(), users.length);
      this.pwgen.generatePassword(); // ← svaki search pravi novi pass!

    });
  }

/*  onUserRowClick(user: User) {
    this.selectedUser.set(user);
    // Dodaj klasu kad je panel otvoren
      }
  onDetailsClose() {
    this.selectedUser.set(undefined);
    this.renderer.removeClass(this.dashboardRoot.nativeElement, 'panel-open');
  }*/

  onUserRowClick(user: User) {
    this.selectedUser.set(user);
    console.log('Da vidimo sta saljemo dalje: ' + JSON.stringify(user));
    this.renderer.addClass(this.dashboardRoot.nativeElement, 'panel-open');
  }

  onDetailsClose() {
    this.selectedUser.set(undefined);
    this.renderer.removeClass(this.dashboardRoot.nativeElement, 'panel-open');
  }

  onPostgresUserSaved(updatedPgUser: UserDTO) {
    this.users.update(users => {
      return users.map(u =>
        u.username === String(updatedPgUser.username)
          ? {
            ...u,
            index: updatedPgUser.indeks ?? u.index,
            institution: updatedPgUser.institucija?.naziv ?? u.institution
          }
          : u
      );
    });
  }


  // Ako želiš snack bar ili slično kada se password kopira
  onPasswordCopied(pass: string) {
    // npr. prikaži notifikaciju
  }
}
