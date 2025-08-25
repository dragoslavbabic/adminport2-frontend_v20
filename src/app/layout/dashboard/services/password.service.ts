// password.service.ts
import { Injectable } from '@angular/core';

const CONSONANTS = 'bdfghjklmnpstvxz';
const VOWELS     = 'aeio';

@Injectable({ providedIn: 'root' })
export class PasswordService {

  private numToSyllable(num: number): string {
    const ch1 = (num >> 12) & 0x0f;
    const ch2 = (num >> 10) & 0x03;
    const ch3 = (num >> 6)  & 0x0f;
    const ch4 = (num >> 4)  & 0x03;
    const ch5 =  num        & 0x0f;
    return [
      CONSONANTS[ch1],
      VOWELS[ch2],
      CONSONANTS[ch3],
      VOWELS[ch4],
      CONSONANTS[ch5],
    ].join('');
  }

  private randomUint16(): number {
    const g = (globalThis as any).crypto?.getRandomValues?.bind(globalThis.crypto);
    if (!g) throw new Error('Secure RNG (crypto.getRandomValues) nije dostupan.');
    const buf = new Uint16Array(1);
    g(buf);
    return buf[0];
  }

  /** parts=3 → npr. "bamiq.nesov.kitax" */
  generate(parts = 3, separator = '.'): string {
    const arr: string[] = [];
    for (let i = 0; i < parts; i++) {
      arr.push(this.numToSyllable(this.randomUint16()));
    }
    return arr.join(separator);
  }
}
