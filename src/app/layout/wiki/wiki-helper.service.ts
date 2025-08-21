import { Injectable } from '@angular/core';
import { WikiWizardStoreService } from './wiki-wizard-store.service';

@Injectable({
  providedIn: 'root'
})
export class WikiHelperService {
  constructor(private wizard: WikiWizardStoreService) {}

  private readonly SEDNICE: Record<'senat'|'savet'|'statutarna'|'etika', string> = {
    senat: 'Сената',
    savet: 'Савета',
    statutarna: 'Одбора за статутарна питања',
    etika: 'Одбора за етичка питања',
  };

  getSednicaTitle(portal: string | null): string {
    switch (portal) {
      case 'senat': return 'Седнице Сената УНС';
      case 'savet': return 'Седнице Савета УНС';
      case 'statutarna': return 'Седнице Одбора за статутарна питања';
      case 'etika': return 'Седнице Одбора за етичка питања';
      default: return '';
    }
  }

  getSednicaHeader(portal: string | null): string {
    switch (portal) {
      case 'senat': return 'седница Сената';
      case 'savet': return 'седница Савета';
      case 'statutarna': return 'седница Одбора за статутарна питања';
      case 'etika': return 'седница Одбора за етичка питања';
      default: return '';
    }
  }

  getTipSedniceHeader(tip: string): string {
    switch (tip) {
      case 'redovna': return 'редовна';
      case 'vanredna': return 'ванредна';
      default: return '';
    }
  }

  getTipSedniceSubHeader(tip: string): string {
    switch (tip) {
      case 'redovna': return 'редовну';
      case 'vanredna': return 'ванредну';
      default: return '';
    }
  }

  getWikiStaticBlock(sednicaHeader: string, prikaziOsnovniTekst: boolean=true): string {
    const zajednickiNaslov = `&nbsp;(:notitle:)(:if !auth edit:)(:noheader:)(:noaction:)(:ifend:)\n\n` +
      `|| border=1 bordercolor=#cccccc rules=rows frame=hsides width=100% cellpadding="5" bgcolor=#f7f7f7\n` +
      `||![+${sednicaHeader}+] ||`

    const samoNaOsnovnojStraniciTekst = `Ако је у току припрема за предстојећу седницу, до сада припремљен материјал се налази на овој страници после уводног текста.

Уколико желите да погледате материјал за неку од претходних седница, погледајте линкове у левом ступцу. Линкове ка седницама одржаним у текућем и претходна три календарска месеца наћи ћете под насловом "Скорашње седнице".
За седнице пре тога, линкови су на страницама које обухватају календарска полугодишта, а до којих можете доћи преко линкова под насловом "Раније седнице".

Првог радног дана после одржавања седнице, сав материјал ће бити пребачен на засебну страницу и везан преко линка под насловом "Скорашње седнице".

|| border=1 bordercolor=#cccccc rules=rows frame=hsides width=100% cellpadding="5" bgcolor=#fffcca
||'''Напомена:''' Док се овај сајт попуњава материјалом, под неким од ових наслова неће бити никаквих линкова. ||

----\n`

    const grb = `(:notitle:)(:if !auth edit:)(:noheader:)(:noaction:)(:ifend:)\n\n\n
%block text-align=center% https://portal.uns.ac.rs/senat/files/slike/grb.png`

    return [
      zajednickiNaslov,
      prikaziOsnovniTekst ? samoNaOsnovnojStraniciTekst : '',
      grb
      ].join('\n\n');
  }

  getWikiHeaderLine(
    brojSednice: string,
    tipSednice: string,
    portal: string,
    datum: string
  ): string {
    const tip = this.getTipSedniceHeader(tipSednice);
    const akuzativTip = this.getTipSedniceSubHeader(tipSednice);
    const naziv = this.getSednicaHeader(portal);
    return `!! %block text-align=center% ''' ${brojSednice}. ${tip} ${naziv} - ${datum} '''\n` +
    `!!! %block text-align=center% Материјал за ${brojSednice}. ${akuzativTip} седницу`;
  }

  // 2025-08-20
  private dateToLink(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

// 20.08.2025
  private dateToDisplay(d: Date): string {
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth() + 1).padStart(2,'0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  private tipPrefix(tip: 'redovna' | 'vanredna' | null | undefined): string {
    // Samo za ванредна dodajemo pridev; за redovna ništa
    return tip === 'vanredna' ? 'ванредна ' : '';
  }

  /** * '''[[Main/YYYY-MM-DD | 4. седница Сената]]'''
   *   %right%[-(20.08.2025)-] */
/*  buildRecentEntry(broj: number, datum: Date, portal: 'senat'|'savet'|'statutarna'|'etika'): string {
    const linkDate = this.dateToLink(datum);
    const dispDate = this.dateToDisplay(datum);
    const label = `${broj}. седница ${this.SEDNICE[portal]}`;
    const tip = this.tipPrefix(s.tipSednice);
    return `* '''[[Main/${linkDate} | ${label}]]'''\n%right%[-(${dispDate})-]`;
  }*/

  buildRecentEntryFromStore(): string {
    const s = this.wizard.state;
    if (!s.portal || !s.sednicaDatum || !s.brojSednice) return '';

    const linkDate = this.dateToLink(s.sednicaDatum);
    const dispDate = this.dateToDisplay(s.sednicaDatum);
    const tip = this.tipPrefix(s.tipSednice);
    const label = `${s.brojSednice}. ${tip}седница ${this.SEDNICE[s.portal]}`;

    return `* '''[[Main/${linkDate} | ${label}]]'''\n%right%[-(${dispDate})-]`;
  }

}
