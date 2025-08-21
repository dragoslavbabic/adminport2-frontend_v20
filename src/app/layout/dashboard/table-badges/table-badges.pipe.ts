import { Pipe, PipeTransform } from '@angular/core';
import { LdapUser } from '../models/ldap-user.model';
import { PostgresUser } from '../models/postgres-user.model';

/**
 * Badge boja za datum isteka (zeleno ako vazi, crveno ako je istekao)
 */
@Pipe({ name: 'badgeColor', standalone: true })
export class BadgeColorPipe implements PipeTransform {
  transform(expirationDate: string | Date): string {
    if (!expirationDate) return 'badge-border-red';
    const today = new Date();
    const compare = new Date(expirationDate);
    return compare >= today ? 'badge-border-green' : 'badge-border-red';
  }
}

@Pipe({
  name: 'accountStatus',
  standalone: true
})
export class AccountStatusPipe implements PipeTransform {
  transform(date: string | Date | undefined): string {
    if (!date) return 'Nalog istekao';
    const today = new Date();
    const compare = new Date(date);
    return compare >= today ? 'Nalog važi' : 'Nalog istekao';
  }
}

/**
 * Badge boja za status naloga (blokiran, aktivan, nema atribut)
 */
@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(shadowExpire: number | null | undefined, studregUserName?: string | null): string {
    if (studregUserName) return 'badge-border-orange'; // warning badge za studente iz studreg
    if (shadowExpire === 0) return 'badge-border-orange';
    if (typeof shadowExpire === 'number' && shadowExpire > 0) return 'badge-border-red';
    return 'badge-border-green';
  }
}

/**
 * Tekst za status naloga
 */
@Pipe({ name: 'userStatusText', standalone: true })
export class UserStatusPipe implements PipeTransform {
  transform(shadowExpire: number | null | undefined, studRegUsername?: string | null): string {
    if (studRegUsername) return 'U PRIPREMI';
    if (shadowExpire === 0) return 'Nema atribut';
    if (typeof shadowExpire === 'number' && shadowExpire > 0) return 'Blokiran';
    return 'Aktivan';
  }
}

@Pipe({ name: 'studregKorisnikClass', standalone: true })
export class StudregKorisnikClassPipe implements PipeTransform {
  transform(studRegUsername?: string | null): string | undefined {
    return !!studRegUsername ? 'username-studreg' : undefined;
  }
}

/**
 * Pipe za badge/ikonice za korišćenje servisa
 */
@Pipe({ name: 'aktivanInfo', standalone: true })
export class AktivanPipe implements PipeTransform {
  transform(value: boolean | null | undefined): { text: string, icon: string, iconClass: string } {
    if (value === true) return { text: 'DA', icon: 'check_circle', iconClass: 'ok' };
    if (value === false) return { text: 'NE', icon: 'report_problem', iconClass: 'warn' };
    return { text: '—', icon: '', iconClass: '' };
  }
}

/**
 * Pipe za prikaz statusa spammera
 */
@Pipe({ name: 'spammerInfo', standalone: true })
export class SpammerPipe implements PipeTransform {
  transform(value: boolean | null | undefined): { text: string, icon: string, iconClass: string, textClass: string } {
    if (value === true) return { text: 'SPAMMER!', icon: 'report_problem', iconClass: 'warn', textClass: 'text-danger' };
    if (value === false) return { text: 'NE', icon: 'check_circle', iconClass: 'ok', textClass: 'text-success' };
    return { text: '—', icon: '', iconClass: '', textClass: '' };
  }
}

/**
 * User warning — korisnik ispunjava neki od posebnih uslova
 */
@Pipe({ name: 'userWarning', standalone: true })
export class UserWarningPipe implements PipeTransform {
  transform(user: { ldap: LdapUser; postgres: PostgresUser }): boolean {
    return (
      user.ldap.ldapUnsService?.includes('norefresh') ||
      !!user.ldap.studregUserName ||
      user.ldap.noShadowLastChange ||
      user.ldap.ldapMailHost !== 'cola.arm.uns.ac.rs'
    );
  }
}

/**
 * Pipe za inicijale korisnika (ime + prezime)
 */
@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  }
}

/**
 * Pipe za filtriranje validnih altUid (bez @uns.ac.rs)
 */
@Pipe({ name: 'altUidFilter', standalone: true })
export class AltUidFilterPipe implements PipeTransform {
  transform(uids: string[] | null | undefined): string[] {
    if (!Array.isArray(uids)) return [];
    return uids.filter(s => !!s && !s.endsWith('@uns.ac.rs'));
  }
}

@Pipe({ name: 'mailHostStatus', standalone: true})
export class MailHostStatusPipe implements PipeTransform {
  transform(mailHost: string | null | undefined) {
    if (mailHost === 'cola.arm.uns.ac.rs') {
      return { color: '#2fd15a', icon: 'circle', tooltip: 'Ispravan mailhost' };
    }
    return { color: '#e44', icon: 'circle', tooltip: 'Neispravan mailhost!' };
  }
}

@Pipe({name: 'homeDirStatus', standalone: true})
export class HomeDirStatusPipe implements PipeTransform {
  transform(homeDir: string | null | undefined, username?: string | null | undefined) {
    if (!homeDir || !username) {
      return {
        color: '#e44',
        icon: 'circle',
        tooltip: 'Nedostaje home dir ili korisničko ime!'
      };
    }
    const expectedPrefix = `/home/mail/${username[0].toLowerCase()}/`;
    const isValid = homeDir.startsWith(expectedPrefix);

    return isValid
      ? {
        color: '#2fd15a',
        icon: 'circle',
        tooltip: 'Ispravan home direktorijum'
      }
      : {
        color: '#e44',
        icon: 'circle',
        tooltip: `Neispravan home dir! Treba da bude: ${expectedPrefix}${username}`
      };
  }
}
