// wiki-wizard-store.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { WikiWizardState, Portal, TipSednice } from './models/wiki-wizard-state.model';

export interface WikiPathCtx {
  portal: Portal;
  godina: string;
  brojSednice: number;
  tipSednice: TipSednice;
}

@Injectable({ providedIn: 'root' })
export class WikiWizardStoreService {
  private readonly _state = signal<WikiWizardState>({
    portal: null,
    tipSednice: null,
    brojSednice: null,
    sednicaDatum: null,
    prikaziOsnovniTekst: false,
    pdfNaziv: '',
    pdfFajl: null,
    brojSedniceError: null,
    tacke: undefined,
  });

  // read-only getter
  get state() { return this._state(); }

  // computed izvedene vrednosti
  readonly godina = computed(() => {
    const d = this._state().sednicaDatum;
    return d ? String(d.getFullYear()) : '';
  });

  readonly datumSR = computed(() => {
    const d = this._state().sednicaDatum;
    return d ? d.toLocaleDateString('sr', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  });

  readonly ctx = computed<WikiPathCtx | null>(() => {
    const s = this._state();
    const godina = this.godina();
    if (!s.portal || !s.tipSednice || !s.brojSednice || !godina) return null;
    return { portal: s.portal, tipSednice: s.tipSednice, brojSednice: s.brojSednice, godina };
  });

  // mutatori – JEDINO ovde menjamo state
  setPortal(p: Portal | null)        { this._state.update(s => ({ ...s, portal: p })); }
  setTipSednice(t: TipSednice | null){ this._state.update(s => ({ ...s, tipSednice: t })); }
  setBrojSednice(n: number | null)   { this._state.update(s => ({ ...s, brojSednice: n })); }
  setDatum(d: Date | null)           { this._state.update(s => ({ ...s, sednicaDatum: d })); }
  setPdf(file: File | null)          { this._state.update(s => ({ ...s, pdfFajl: file, pdfNaziv: file?.name ?? '' })); }
  setPrikaziOsnovniTekst(v: boolean) { this._state.update(s => ({ ...s, prikaziOsnovniTekst: v })); }
  setBrojSedniceError(msg: string | null){ this._state.update(s => ({ ...s, brojSedniceError: msg })); }
  setTacke(t: WikiWizardState['tacke'])  { this._state.update(s => ({ ...s, tacke: t })); }

  reset() {
    this._state.set({
      portal: null, tipSednice: null, brojSednice: null, sednicaDatum: null,
      prikaziOsnovniTekst: false, pdfNaziv: '', pdfFajl: null,
      brojSedniceError: null, tacke: undefined
    });
  }
}
