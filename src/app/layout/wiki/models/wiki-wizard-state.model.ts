// models/wiki-wizard-state.model.ts
export type Portal = 'senat' | 'savet' | 'statutarna' | 'etika';
export type TipSednice = 'redovna' | 'vanredna';

export interface WikiWizardState {
  portal: Portal | null;
  tipSednice: TipSednice | null;
  brojSednice: number | null;   // ← jedino “broj” polje
  sednicaDatum: Date | null;    // ← jedino datum polje
  prikaziOsnovniTekst: boolean;

  pdfNaziv: string;
  pdfFajl: File | null;

  brojSedniceError?: string | null;

  // rezultat backenda (liste tačaka)
  tacke?: string[] | [string[], string[]] | undefined;
}
