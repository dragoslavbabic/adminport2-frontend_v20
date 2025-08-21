import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateAdapter } from '@angular/material/core';

import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

import { environment } from '../../../environments/environment';
import { WikiHelperService } from './wiki-helper.service';
import { WikiWizardStoreService } from './wiki-wizard-store.service';
import { WikiPointsService } from './wiki-points.service';

import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core'; // koristi Native
import localeSrCyrl from '@angular/common/locales/sr-Cyrl';

registerLocaleData(localeSrCyrl);

export const SR_CYRL_DATE_FORMATS = {
  parse: {
    dateInput: 'd. MMMM y.',   // 20. август 2025.
  },
  display: {
    dateInput: 'd. MMMM y.',   // u polju
    monthYearLabel: 'MMMM y',  // u kalendaru
    dateA11yLabel: 'd. MMMM y.',
    monthYearA11yLabel: 'MMMM y',
  },
};
@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [
    // Material
    MatCard, MatCardContent, MatCardSubtitle, MatButtonToggleGroup, MatButtonToggle,
    MatFormField, MatFormFieldModule, MatInput, MatInputModule,
    MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDatepickerModule,
    MatButton, MatIconButton, MatIcon, MatCheckboxModule, MatSlideToggle,
    FormsModule, MatCardTitle, MatDividerModule,MatNativeDateModule,

  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'sr-Cyrl' },
    { provide: LOCALE_ID, useValue: 'sr-Cyrl' },
    { provide: MAT_DATE_FORMATS, useValue: SR_CYRL_DATE_FORMATS }
  ],
  templateUrl: './wiki.html',
  styleUrl: './wiki.scss'
})
export class Wiki {
  private readonly baseURL = environment.baseUrl;
  pmWikiDokumenta:any;

  constructor(
    private dateAdapter: DateAdapter<any>,
    private http: HttpClient,
    public wikiHelper: WikiHelperService,
    public wikiStore: WikiWizardStoreService,
    public wikiTacke: WikiPointsService
  ) {
    // Lokalizacija datepickera (ćirilica)
    this.dateAdapter.setLocale('sr-RS');
  }

  // --------- STEP vidljivost (čita isključivo iz store-a) ----------
  get showStep2() {
    return !!this.wikiStore.state.portal;
  }
  get showStep3() {
    const s = this.wikiStore.state;
    return !!s.portal && !!s.tipSednice;
  }
  get showStep4() {
    const s = this.wikiStore.state;
    return !!s.portal && !!s.tipSednice && !!s.sednicaDatum;
  }
  get showStep5() {
    const s = this.wikiStore.state;
    return !!s.portal && !!s.tipSednice && !!s.sednicaDatum && !!s.brojSednice && !s.brojSedniceError;
  }
  get showStep6() {
    const s = this.wikiStore.state;
    return !!s.portal && !!s.tipSednice && !!s.sednicaDatum && !!s.brojSednice && !!s.pdfNaziv;
  }

  // --------- UI handleri – ISKLJUČIVO mutatori store-a ----------
  setPortal(value: 'senat' | 'savet' | 'statutarna' | 'etika') {
    this.wikiStore.setPortal(value);
  }
  setSednicaTip(value: 'redovna' | 'vanredna') {
    this.wikiStore.setTipSednice(value);
  }
  setDatum(event: any) {
    // Angular Material datepicker šalje { value: Date }
    const d: Date | null = event?.value ? new Date(event.value) : null;
    this.wikiStore.setDatum(d);
  }
  setSednicaBroj(ev: Event) {
    const raw = (ev.target as HTMLInputElement).value ?? '';
    if (!/^\d+$/.test(raw)) {
      this.wikiStore.setBrojSednice(null);
      this.wikiStore.setBrojSedniceError('Dozvoljeni su samo brojevi!');
      return;
    }
    const n = Number(raw);
    if (n < 1 || n > 99) {
      this.wikiStore.setBrojSednice(null);
      this.wikiStore.setBrojSedniceError('Broj sednice mora biti između 1 i 99!');
      return;
    }
    this.wikiStore.setBrojSednice(n);
    this.wikiStore.setBrojSedniceError(null);
  }

  // …u klasi:
  get recentEntry(): string {
    const s = this.wikiStore.state;
    if (!s.portal || !s.sednicaDatum || !s.brojSednice || !s.tipSednice) return '';
/*
    return this.wikiHelper.buildRecentEntryFromStore(s.brojSednice, s.sednicaDatum, s.portal, s.tipSednice);
*/
    return this.wikiHelper.buildRecentEntryFromStore();
  }
  onPdfSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.wikiStore.setPdf(file);
  }
  onToggleOsnovniTekst(v: boolean) {
    this.wikiStore.setPrikaziOsnovniTekst(v);
  }

  // --------- Slanje na backend + generisanje tačaka ----------
  pmWikiTacke = ''; // renderovani spisak tačaka

  sendWikiData() {
    const s = this.wikiStore.state;

    // Minimalna validacija konteksta
    if (!s.portal || !s.tipSednice || !s.sednicaDatum || !s.brojSednice) {
      console.warn('Nedostaju parametri za wiki (portal/tip/datum/broj).');
      return;
    }

    // Backend očekuje: ["senat","redovna","2025","4"] (ali mi šaljemo kao CSV po dogovoru)
    const payload = [
      s.portal.toLowerCase(),
      s.tipSednice.toLowerCase(),
      String(s.sednicaDatum.getFullYear()),
      String(s.brojSednice),
    ].join(',');

    const formData = new FormData();
    if (s.pdfFajl) formData.append('file', s.pdfFajl);
    formData.append('fileListParam', payload);

    this.http.post(this.baseURL + '/wiki/', formData).subscribe({
      next: (data) => {
        // Očekujemo string[] ili [string[], string[]]
        this.wikiStore.setTacke(data as any);
        // NOVO: dokumenta-blok iz drugog niza
        this.pmWikiDokumenta = this.wikiTacke.buildDocsBlockFromStore(this.wikiStore.state.tacke ?? []);
        // Servis uzima ctx iz store-a i sam normalizuje data[0]
        this.pmWikiTacke = this.wikiTacke.buildFromStoreColumns(this.wikiStore.state.tacke ?? []);
      },
      error: (err) => {
        console.error('Wiki upload error:', err);
      }
    });
  }

  // --------- Render celog PMWiki koda (header + statika + tačke) ----------
  get pmWikiKod(): string {
    const s = this.wikiStore.state;

    // Datum (ćirilica) – koristi computed iz store-a ako ga imaš (npr. datumSR),
    // ili fallback na lokalnu formatizaciju:
    const datumSR =
      (this.wikiStore as any).datumSR?.() ??
      (s.sednicaDatum
        ? s.sednicaDatum.toLocaleDateString('sr', { day: 'numeric', month: 'long', year: 'numeric' })
        : '');

    const headerLine = this.wikiHelper.getWikiHeaderLine(
      s.brojSednice != null ? String(s.brojSednice) : '',
      s.tipSednice ?? '',
      s.portal ?? '',
      datumSR
    );

    const staticBlock = this.wikiHelper.getWikiStaticBlock(
      this.wikiHelper.getSednicaTitle(s.portal ?? ''),
      s.prikaziOsnovniTekst
    );
    return [staticBlock, headerLine, this.pmWikiDokumenta, this.pmWikiTacke ?? ''].join('\n\n');
  }

  // --------- Copy helper ----------
  kopirano = false;
  kopirajWikiKod() {
    navigator.clipboard.writeText(this.pmWikiKod).then(() => {
      this.kopirano = true;
      setTimeout(() => (this.kopirano = false), 1500);
    });
  }

  protected readonly navigator = navigator;

  kopirano_skorasnje_link = false;
  kopirajSkorasnjeLink() {
    navigator.clipboard.writeText(this.recentEntry).then(() => {
      this.kopirano_skorasnje_link = true;
    });
  }
}


