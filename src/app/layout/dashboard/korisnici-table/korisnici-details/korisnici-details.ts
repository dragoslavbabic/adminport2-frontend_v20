import {Component, effect, EventEmitter, Input, Output, signal} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from '../../models/user.model'; // prilagodi path!
import { LdapCard } from './ldap-card/ldap-card';
import { LogCard } from './log-card/log-card';
import { PostgresCard } from './postgres-card/postgres-card';
import {mapApiLdapUser} from '../../models/ldap-user.mapper';
import {mapApiPostgresUser} from '../../models/postgres-user.mapper';
import {DatePipe, JsonPipe, NgClass} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {AccountStatusPipe, BadgeColorPipe, InitialsPipe} from '../../table-badges/table-badges.pipe';
import {PostgresUserService} from '../../services/postgres-user.service';
import {PostgresUser,UserDTO} from '../../models/postgres-user.model';
import {PostgresInstitucija} from '../../models/postgres-institucija.model';
import {PostgresStatus} from '../../models/postgres-status.model';
import {InstitucijaService} from '../../services/postgres-institucija.service';
import {StatusService} from '../../services/postgres-status.service';
import {ViewContainerRef} from '@angular/core';

@Component({
  selector: 'korisnici-details',
  standalone: true,
  imports: [MatTabsModule, LdapCard, LogCard, PostgresCard, MatIconButton, MatTooltip, MatIcon, NgClass, InitialsPipe, BadgeColorPipe, AccountStatusPipe,],
  templateUrl: './korisnici-details.html',
  styleUrls: ['./korisnici-details.css']
})
export class KorisniciDetails {
  // Moderni signal @Input (Angular 17+)
  private _user = signal<User | undefined>(undefined);
  @Input() set user(value: User | undefined) {
    this._user.set(value);
  }
  @Output() userSaved = new EventEmitter<UserDTO>();
  institucije = signal<PostgresInstitucija[]>([])
  statusi = signal<PostgresStatus[]>([]);
  pgUser = signal<UserDTO | null>(null);
  onUserSaved(newUser: UserDTO) {
    this.pgUser.set(newUser);
    this.userSaved.emit(newUser); //vracamo promene u Dashboard
    //console.log('da li emitujemo: ' + JSON.stringify(newUser) );
  }
  get user() { return this._user(); }

  constructor(private pgService: PostgresUserService,
              private pgInstitucijaService: InstitucijaService,
              private pgStatusService: StatusService,
              public viewContainerRef: ViewContainerRef ) {
    effect(() => {
      const currentUser = this._user();
      if (!currentUser) return;

      // 👇 resetuj state pre novog upita
      this.pgUser.set(null);

      this.pgService.getUser(currentUser.username).subscribe(u => this.pgUser.set(Array.isArray(u) ? u[0] : u ?? null));
      //console.log('korisnik u details: ' + JSON.stringify(this.pgUser, null, 2));
      this.pgInstitucijaService.getInstitucije().subscribe(i => this.institucije.set(i));
      this.pgStatusService.getStatusi().subscribe(s => this.statusi.set(s));
    });
  }

  protected readonly mapApiLdapUser = mapApiLdapUser;
  protected readonly mapApiPostgresUser = mapApiPostgresUser;
}
