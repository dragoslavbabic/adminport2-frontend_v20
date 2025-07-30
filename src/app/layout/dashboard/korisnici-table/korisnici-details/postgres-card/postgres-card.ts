import {Component, effect, EventEmitter, Input, input, Output, signal, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostgresUserService } from '../../../services/postgres-user.service';
import { MatInput} from '@angular/material/input';
import {MatButton,} from '@angular/material/button';
import { MatCard,} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { PostgresUser } from '../../../models/postgres-user.model'
import { PostgresInstitucija } from '../../../models/postgres-institucija.model';
import { PostgresStatus } from '../../../models/postgres-status.model';
import { User } from '../../../models/user.model';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'postgres-card',
  templateUrl: './postgres-card.html',
  styleUrls: ['./postgres-card.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatIcon,
    MatSelect,
    MatOption,
    MatCard,
    MatSnackBarModule,
  ]
})
export class PostgresCard {
  pgUser = input<PostgresUser | null>(null);
  lastname = input<string | undefined>(undefined);
  username = input<string | undefined>(undefined);
  fullname = input<string | undefined>(undefined);
  baseUser = input<User | null>(null);
  institucije = input<PostgresInstitucija[]>([]);
  statusi = input<PostgresStatus[]>([]);
  editMode = signal(false);

  @Input() viewContainerRef: ViewContainerRef | undefined;
  @Output() userSaved = new EventEmitter<PostgresUser>();

  // Reactive form kao signal
  form = signal<FormGroup>(null!);

  constructor(private fb: FormBuilder, private pgUserService: PostgresUserService, private snackBar: MatSnackBar) {
    this.form.set(this.createEmptyForm());
    // Sync forma sa inputima i edit modom
    effect(() => {
      this.patchFormData();
      if (this.editMode()) {
        this.form().enable({ emitEvent: false });
      } else {
        this.form().disable({ emitEvent: false });
      }
    });
  }

  /** Helper: vrati praznu formu */
  private createEmptyForm(): FormGroup {
    return this.fb.group({
      id: [null],
      rawPgUsername: [''],
      rawPgIme: [''],
      rawPgPrezime: [''],
      rawPgAdresa: [''],
      rawPgTelefon: [''],
      rawPgIndeks: [null],
      rawPgInstitucija: [null],
      rawPgStatus: [null],
      rawPgKomentar: [''],
      rawPgDatum: [null],
    });
  }

  /** Helper: postavi vrednosti u formu na osnovu inputa */
  private patchFormData() {
    const user = this.pgUser();
    if (user) {
      this.form().patchValue({
        id: user.id,
        rawPgUsername: user.rawPgUsername ?? '',
        rawPgIme: user.rawPgIme ?? '',
        rawPgPrezime: user.rawPgPrezime ?? '',
        rawPgAdresa: user.rawPgAdresa ?? '',
        rawPgTelefon: user.rawPgTelefon ?? '',
        rawPgIndeks: user.rawPgIndeks ?? null,
        rawPgInstitucija: user.rawPgInstitucija ?? null,
        rawPgStatus: user.rawPgStatus ?? null,
        rawPgKomentar: user.rawPgKomentar ?? '',
        });
    } else {
      // Novi korisnik: popuni iz LDAP (ili ostavi prazno)
      this.form().patchValue({
        id: null,
        rawPgUsername: this.username() ?? '',
        rawPgIme: this.fullname() ?? '',
        rawPgPrezime: this.lastname() ?? '',
        rawPgAdresa: '',
        rawPgTelefon: '',
        rawPgIndeks: null,
        rawPgInstitucija: null,
        rawPgStatus: null,
        rawPgKomentar: '',
        rawPgDatum: null,
      });
    }
  }

  // Submit
  submit() {
    const group = this.form();
    if (group && group.valid) {
      this.pgUserService.saveUser(group.value).subscribe({
        next: (resp: PostgresUser) => {
          // Ne patchuj lokalno! Samo emit-uj event parentu
          this.userSaved.emit(resp);
          this.editMode.set(false);
          group.disable({ emitEvent: false });
          this.snackBar.open('Promene sačuvane!', '',{
            duration: 2000,
            panelClass: ['snackbar-success'],
            viewContainerRef: this.viewContainerRef,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
        },
        error: (err) => {
          /* error obrada */
        this.snackBar.open(err.message, '',{
          duration: 2000,
          panelClass: ['snackbar-error'],
        })},
      });
    }
  }

  startEdit() {
    this.editMode.set(true);
    this.form().enable();
  }

  cancelEdit() {
    this.editMode.set(false);
    this.form().disable();
    this.patchFormData(); // Resetuj na vrednosti iz inputa
  }

  compareById = (a: any, b: any) => a && b && a.id === b.id;
}
