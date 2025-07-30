import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'korisnici-search',
  standalone: true,
  templateUrl: './korisnici-search.html',
  styleUrls: ['./korisnici-search.css'],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class KorisniciSearch {
  private fb = inject(FormBuilder);
  @Output() search = new EventEmitter<{ data: string, attr: string }>();

  searchBox = this.fb.group({
    searchBox: ['', [Validators.required, Validators.minLength(3)]]
  });

  invalidInput = false;

  constructor() {}

  onSearch() {
    if (this.searchBox.invalid) {
      this.invalidInput = true;
      return;
    }
    this.invalidInput = false;
    let data = this.searchBox.value.searchBox?.trim() ?? '';
    let attr = 'uid';

    if (data.endsWith(' cn')) {
      data = data.replace(/\bcn\b/g, '').trim();
      attr = 'cn';
    }
    if (data.includes('@uns.ac.rs')) {
      data = data.replace('@uns.ac.rs', '');
    }

    this.search.emit({ data, attr });
  }
}
