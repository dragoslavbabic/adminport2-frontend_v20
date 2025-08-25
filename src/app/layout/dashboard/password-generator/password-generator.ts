import {Component, Output, EventEmitter, signal} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {KorisniciService} from '../services/korisnici-service';
import {PasswordService} from '../services/password.service';

@Component({
  selector: 'password-generator',
  standalone: true,
  templateUrl: './password-generator.html',
  styleUrls: ['./password-generator.css'],
  imports: [MatCardModule, MatIconModule, MatButtonModule]
})
export class PasswordGenerator {
  pass = signal<string>('');

  constructor(private korisniciService: KorisniciService, private pw: PasswordService) {}

  ngOnInit() {
    this.generatePassword();
  }

/*  generatePassword() {
    this.korisniciService.getRandomPass().subscribe({
      next: res => this.pass.set(res.pass),
      error: () => this.pass.set('Greška!')
    });
  }*/

  generatePassword() {
    this.pass.set(this.pw.generate(3, '.'));
  }

  copyPassword() {
    navigator.clipboard.writeText(this.pass());
  }
}
