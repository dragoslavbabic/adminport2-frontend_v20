import {Component, effect, input, Input, signal} from '@angular/core';
import { LdapUser} from '../../../models/ldap-user.model';
import {DatePipe, JsonPipe, NgClass, NgStyle,} from '@angular/common';
import {MatCard,} from '@angular/material/card';
import {
  AktivanPipe,
  AltUidFilterPipe, HomeDirStatusPipe,
  MailHostStatusPipe,
  SpammerPipe,
  UserStatusPipe
} from '../../../table-badges/table-badges.pipe'; // Prilagodi putanju!
import {KeyValuePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {KorisniciService} from '../../../services/korisnici-service';
import {MatTooltip} from '@angular/material/tooltip';
import {PostgresInstitucija} from '../../../models/postgres-institucija.model';

@Component({
  selector: 'ldap-card',
  standalone: true,
  templateUrl: './ldap-card.html',
  imports: [
    DatePipe,
    MatCard,
    MatIcon,
    NgClass,
    SpammerPipe,
    AktivanPipe,
    AltUidFilterPipe,
    NgStyle,
    MailHostStatusPipe,
    MatTooltip,
    HomeDirStatusPipe,
  ],
  styleUrls: ['./ldap-card.css']
})
export class LdapCard {
  @Input() user?: LdapUser;
  //@Input() institution?: string;
  institution = input<string | undefined>(undefined);

  spammerInfo = signal<{ spammer: boolean, Aktivan: boolean } | null>(null);

  constructor(private korisniciService: KorisniciService) {
    effect(() => {
      if (this.user?.ldapUsername) {
        console.log('Institution u ldap-card:', this.institution());
        this.korisniciService.checkSpammer(this.user.ldapUsername).subscribe({
          next: (res) => this.spammerInfo.set(res),
          error: () => this.spammerInfo.set(null)
        });
      }
    });
  }
}
