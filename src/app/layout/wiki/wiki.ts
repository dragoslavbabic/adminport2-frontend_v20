import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-wiki',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatButtonToggleGroup,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatIcon,
    MatButtonToggle,
    MatDatepickerInput,
    FormsModule,
    MatButton,
    MatIconButton,
    MatInput,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    NgForOf,
    MatCardSubtitle,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  standalone: true,
  templateUrl: './wiki.html',
  styleUrl: './wiki.css'
})
export class Wiki {
  sednice = [
    { value: 'Senat', label: 'Senat' },
    { value: 'Savet', label: 'Savet' },
    { value: 'Statuturna', label: 'Statuturna' },
    { value: 'Etika', label: 'Etika' }
  ];
  sednicaType = 'Senat';
  tipSednice = 'Redovna';
  datum: Date | null = null;
  brojSednice: number | null = null;
  pdfNaziv = '';

  onPdfSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.pdfNaziv = fileInput.files[0].name;
    }
  }

  generisiWiki() {
    // Ovde ćeš kasnije dodati generisanje wiki koda
    alert('TODO: Generisati wiki kod!');
  }

}

