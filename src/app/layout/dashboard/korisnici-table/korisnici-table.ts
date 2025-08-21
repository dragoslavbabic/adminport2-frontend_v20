import {Component, Input, Output, EventEmitter, ViewEncapsulation, input} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../models/user.model';
import {DatePipe, JsonPipe, NgClass, NgIf} from '@angular/common';
import {BadgeColorPipe, AltUidFilterPipe, StudregKorisnikClassPipe} from '../table-badges/table-badges.pipe';
import {StatusBadgePipe} from '../table-badges/table-badges.pipe';
import {UserStatusPipe} from '../table-badges/table-badges.pipe';
import {KorisniciService} from '../services/korisnici-service';
import { UserWarningPipe } from '../table-badges/table-badges.pipe';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCard} from '@angular/material/card';

type UIAction = 'block_unblock' | 'extend';
type BackendAction = 'block' | 'unblock' | 'extend';

@Component({
  selector: 'korisnici-table',
  standalone: true,
  templateUrl: './korisnici-table.html',
  styleUrls: ['./korisnici-table.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [MatTableModule, BadgeColorPipe, StatusBadgePipe, UserStatusPipe, UserWarningPipe, NgClass, DatePipe, MatIconButton, MatTooltip, MatIcon, AltUidFilterPipe, MatProgressSpinner, StudregKorisnikClassPipe, MatCard,]
})

export class KorisniciTable {
  users = input<User[]>([]);
  searched = input<boolean>(false);
  searchInProgress = input<boolean>(false);
  @Output() rowClicked = new EventEmitter<User>();





  actionLoading: { [username: string]: boolean } = {};
  constructor(private korisniciService: KorisniciService) {}

  displayedColumns = [
    'num', 'username', 'fullName', 'activeTo', 'index', 'institution', 'status','blocked_date'
  ];

  copyUsername(username: string, event: MouseEvent) {
    event.stopPropagation(); // Da ne otvara detalje na klik
    navigator.clipboard.writeText(username).then(() => {
      // Možeš dodati notifikaciju ili snackbar ovde ako želiš!
      // npr. this.snackBar.open('Korisničko ime kopirano!', '', { duration: 1500 });
    });
  }

  onRowClick(user: User) {
    this.rowClicked.emit(user);
    //console.log('STUDREG ' + user.studRegUsername);
  }

  accountAction(user: User, action: UIAction, event?: MouseEvent): void {
    this.actionLoading[user.username] = true;
    event?.stopPropagation(); // Spreči da klik na dugme otvara detalje

    // Odredi šta zapravo šalješ backendu:
    let backendAction: BackendAction;
    if (action === 'block_unblock') {
      const x = typeof user.shadowExpire === 'number' ? user.shadowExpire : 0;
      backendAction = x < 0 ? 'block' : 'unblock';
    } else {
      backendAction = 'extend';
    }

    this.korisniciService.sshAccountAction(user.username, backendAction).subscribe({

      next: (res) => {
        //console.log('STUDREG ' + user.studRegUsername);
        user.activeTo = res['Password Expires'];

        if (res['Account Expires'] === 'Never') {
          user.shadowExpire = -1;
        } else {
          const expireDate = new Date(res['Account Expires']);
          user.shadowExpire = Math.floor(expireDate.getTime() / 1000 / 86400);
          //console.log('traba nam datum: ' + user.shadowExpire);
        }
        // Dodaj i ovu liniju (ako koristiš user.blocked za prikaz badge-a!):
        user.blocked = !!user.shadowExpire && user.shadowExpire > 0;
        this.actionLoading[user.username] = false;
        user.isActive = false;
      },
      error: () => {
        this.actionLoading[user.username] = false;
        user.isActive = false;
        // Prikazati grešku ako treba
      }
    });
  }

  isExpired(dateStr: string): boolean {
    if (!dateStr) return true;
    const today = new Date();
    const date = new Date(dateStr);
    return date < today;
  }

  protected readonly status = status;
}
