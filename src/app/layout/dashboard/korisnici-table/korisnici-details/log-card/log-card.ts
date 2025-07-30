import { Component, Input, signal } from '@angular/core';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatCardContent} from '@angular/material/card';
import {LogService,RadiusLog} from '../../../services/logs.service';

@Component({
  selector: 'log-card',
  standalone: true,
  templateUrl: './log-card.html',
  imports: [
    MatTab,
    MatCardContent,
    MatTabGroup
  ],
  styleUrls: ['./log-card.css']
})
export class LogCard {
  @Input() user: string | undefined; // ili korisnik ili email, kako god backend traži

  loading = signal(false);
  logs = signal<RadiusLog[] | null>(null);
  error = signal<string | null>(null);

  constructor(private logService: LogService) {}

  loadLogs() {
    if (!this.user) return;
    this.loading.set(true);
    this.error.set(null);
    this.logs.set(null);

    this.logService.getRadiusLogsForUser(this.user).subscribe({
      next: (data) => {
        this.logs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Greška pri učitavanju logova!');
        this.loading.set(false);
      }
    });
  }

  // format za prikaz
  formatLog(log: RadiusLog): string {
    return `${log.radiusDate} ${log.status} (${log.error ?? ''}) [${log.user}${log.ostatak ?? ''}] (${log.client}) ${log.mac}`;
  }
}
