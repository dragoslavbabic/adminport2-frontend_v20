import {Component, Output, EventEmitter, signal} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {KorisniciService} from '../services/korisnici-service';

@Component({
  selector: 'password-generator',
  standalone: true,
  templateUrl: './password-generator.html',
  styleUrls: ['./password-generator.css'],
  imports: [MatCardModule, MatIconModule, MatButtonModule]
})
export class PasswordGenerator {
  pass = signal<string>('');

  constructor(private korisniciService: KorisniciService) {}

  ngOnInit() {
    this.generatePassword();
  }

  generatePassword() {
    this.korisniciService.getRandomPass().subscribe({
      next: res => this.pass.set(res.pass),
      error: () => this.pass.set('Greška!')
    });
  }

  copyPassword() {
    navigator.clipboard.writeText(this.pass());
  }
}
