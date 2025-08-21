// wiki-points.service.ts
import { Injectable } from '@angular/core';
import {TipSednice} from './models/wiki-wizard-state.model';
import {WikiWizardStoreService} from './wiki-wizard-store.service';

export interface WikiPathCtx {
  portal: 'senat' | 'savet' | 'statutarna' | 'etika';
  godina: string;
  brojSednice: number;
  tipSednice: TipSednice;
}

@Injectable({ providedIn: 'root' })
export class WikiPointsService {
  constructor(private wizard: WikiWizardStoreService) {}

  // Kolonizovana varijanta – ista logika čišćenja, ali raspored u 5 kolona
  buildFromStoreColumns(raw: string[] | [string[], string[]], columns = 5): string {
    const ctx = this.wizard.ctx();
    if (!ctx) return '';

    // sve isto kao i u buildFromStore
    const normalized = this.normalize(raw);
/*    const cleaned = this.keepContinuousTopLevelPrefix
      ? this.enforceConsecutiveTopLevel(normalized)
      : normalized;
    const deduped = this.preferWithFile(cleaned);*/

    // umesto da ih spojimo u jedan niz, prvo prerenderujemo svaku liniju
    const rendered = normalized
      .sort((a, b) => { // isto sortiranje kao u buildWikiList
        const A = this.parseItem(a).point.split('.').map(n => +n);
        const B = this.parseItem(b).point.split('.').map(n => +n);
        for (let i = 0; i < Math.max(A.length, B.length); i++) {
          const da = A[i] ?? -1, db = B[i] ?? -1;
          if (da !== db) return da - db;
        }
        return 0;
      })
      .map(it => this.renderLine(ctx, it));

    return this.columnize(rendered, columns);
  }

  /** Spakuje linije u jednu tabelu sa N kolona (jedan red, N ćelija). */
  private columnize(lines: string[], requestedCols = 5): string {
    if (!lines.length) return '';

    const cols = Math.max(1, Math.min(requestedCols, lines.length));
    if (cols === 1) return lines.join('\n'); // nema potrebe za tabelom

    const perCol = Math.ceil(lines.length / cols);
    const widthPct = (100 / cols).toFixed(2); // dinamička širina
    const open  = '(:table width=100% align=left bgcolor=#f7f7f7 border="1" bordercolor=#cccccc style=border-collapse:collapse cellspacing=0 cellpadding="10" :)';
    const close = '(:tableend:)';

    const cells: string[] = [];
    for (let i = 0; i < cols; i++) {
      const start = i * perCol;
      const end   = Math.min(start + perCol, lines.length);
      const chunk = lines.slice(start, end);

      const cellTag = i === 0
        ? `(:cellnr width=${widthPct}% valign=top:)`
        : `(:cell width=${widthPct}% valign=top:)`;

      cells.push([cellTag, ...chunk].join('\n'));
    }

    return [open, ...cells, close].join('\n');
  }

  // Javni API: prosledi raw data sa backend-a (points[] ili [points[], files[]])
  buildFromStore(raw: string[] | [string[], string[]]): string {
    const ctx = this.wizard.ctx();
    console.log('STORE state:', this.wizard.state);
    console.log('CTX:', this.wizard.ctx());           // ako je null -> fali neki parametar
    console.log('RAW data:', raw);
    if (!ctx) return ''; // ili baci grešku/toast

    const normalized = this.normalize(raw);
    return this.buildWikiList(ctx, normalized);
  }

  // --- Normalizacija samo nad data[0], kako si tražio ---
  private normalize(pointsArrayOrTuple: any): string[] {
    const arr: string[] = Array.isArray(pointsArrayOrTuple?.[0])
      ? (pointsArrayOrTuple[0] as string[])
      : (pointsArrayOrTuple as string[]);

    return arr.map(s => {
      const [left, right] = String(s).split(':', 2);
      const clean = left.replace(/\.$/, ''); // "2.1.1." -> "2.1.1"
      return right ? `${clean}:${right.trim()}` : clean; // ← zadrži originalni naziv fajla
    });
  }

  private tipSufiks(t: TipSednice): '' | '-v' {
    return t === 'vanredna' ? '-v' : '';
  }

  private baseUrl(ctx: WikiPathCtx): string {
    const suf = this.tipSufiks(ctx.tipSednice);
    return `https://portal.uns.ac.rs/${ctx.portal}/files/${ctx.godina}/${ctx.godina}-${ctx.brojSednice}${suf}`;
  }

  private parseItem(item: string): { point: string; file?: string | null } {
    const [rawPoint, file] = item.split(':', 2);
    const point = rawPoint.replace(/\.$/, '');
    return { point, file: file ?? null };
  }

  private levelOf(point: string): number {
    return point.split('.').filter(Boolean).length;
  }

  private labelL1(p: string) { return `${p}. тачка`; }
  private labelLn(p: string) { return `[-${p}.-]`; }
  private urlFor(ctx: WikiPathCtx, point: string, file?: string | null): string {
    const base = this.baseUrl(ctx);
    return file ? `${base}/${file}` : `${base}/${point}.pdf`; // ← PDF samo kad file nije naveden
  }

  private renderLine(ctx: WikiPathCtx, item: string): string {
    const { point, file } = this.parseItem(item);
    const lvl = this.levelOf(point);
    const url = this.urlFor(ctx, point, file);

    if (lvl === 1) {
      const label = this.labelL1(point);
      return file
        ? `*[[${url}|${label}]]`
        : `*${label}\n%comment%*[[${url}|${label}]]`;
    }
    if (lvl === 2) {
      const label = this.labelLn(point);
      return file
        ? `->'''&nbsp;&nbsp;[[${url}|${label}]]'''`
        : `->'''&nbsp;&nbsp;${label}'''\n%comment%->'''&nbsp;&nbsp;[[${url}|${label}]]'''`;
    }
    const label = this.labelLn(point);
    return file
      ? `**[[${url}|${label}]]`
      : `**${label}\n%comment%**[[${url}|${label}]]`;
  }

  private sortItems(items: string[]): string[] {
    return [...items].sort((a, b) => {
      const A = this.parseItem(a).point.split('.').map(n => +n);
      const B = this.parseItem(b).point.split('.').map(n => +n);
      for (let i = 0; i < Math.max(A.length, B.length); i++) {
        const da = A[i] ?? -1, db = B[i] ?? -1;
        if (da !== db) return da - db;
      }
      return 0;
    });
  }

  buildDocsBlockFromStore(raw: string[] | [string[], string[]]): string {
    const ctx = this.wizard.ctx();
    if (!ctx) return '';

    // izdvoji niz fajlova iz drugog elementa ako je tuple
    const files: string[] = Array.isArray(raw?.[1]) ? (raw as [string[], string[]])[1] : (Array.isArray(raw) ? (raw as string[]) : []);
    const fileSet = new Set(files.map(f => f.trim().toLowerCase()));

    const base = this.baseUrl(ctx); // npr: https://portal.uns.ac.rs/senat/files/2025/2025-16-v

    // spisak kandidata (redosled i label fiksni)
    const docs = [
      { file: 'Poziv.pdf',                       label: 'Позив' },
      { file: 'Dopuna_dnevnog_reda.pdf',         label: 'Допуна дневног реда' },
      { file: 'Dopuna_dnevnog_reda_2.pdf',       label: 'Допуна дневног реда-2' },
      { file: 'Poziv_preciscen_tekst.pdf',       label: 'Позив - пречишћен текст' },
      { file: 'predlog_dopune_dnevnog_reda.pdf', label: 'Предлог допуне дневног редa' },
    ];

    const open  = '(:table width=100% align=left bgcolor=#f7f7f7 border="1" bordercolor=#cccccc style=border-collapse:collapse cellspacing=0 cellpadding = "10" :)';
    const cell  = '(:cellnr width=20%:)';
    const close = '(:tableend:)';

    const lines = docs.map(d => {
      const href = `${base}/${d.file}`;
      const exists = fileSet.has(d.file.toLowerCase());
      const line = `*[[${href}|${d.label}]]`;
      return exists ? line : `%comment%${line}`;
    });

    return [open, cell, ...lines, close].join('\n');
  }

  buildWikiList(ctx: WikiPathCtx, items: string[]): string {
    const sorted = this.sortItems(items);
    return sorted.map(it => this.renderLine(ctx, it)).join('\n');
  }
}
