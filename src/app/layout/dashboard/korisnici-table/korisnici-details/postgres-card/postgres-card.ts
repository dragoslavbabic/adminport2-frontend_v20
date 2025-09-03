import {Component, effect, EventEmitter, Input, input, Output, Signal, signal, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, isFormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { PostgresUserService } from '../../../services/postgres-user.service';
import { MatInput} from '@angular/material/input';
import {MatButton,} from '@angular/material/button';
import { MatCard,} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { PostgresUser,UserDTO, UserUpdateDTO, UserCreateDTO, StatusDTO, InstitucijaDTO } from '../../../models/postgres-user.model'
import { PostgresInstitucija } from '../../../models/postgres-institucija.model';
import { PostgresStatus } from '../../../models/postgres-status.model';
import { User } from '../../../models/user.model';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';

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
  //pgUser = input<UserDTO | null>(null);
  lastname = input<string | undefined>(undefined);
  username = input<string | undefined>(undefined);
  fullname = input<string | undefined>(undefined);
  info = input<string | undefined>(undefined);
  baseUser = input<User | null>(null);
  institucije = input<PostgresInstitucija[]>([]);
  statusi = input<PostgresStatus[]>([]);
  editMode = signal(false);

  @Input() pgUser!: Signal<UserDTO | null>;
  @Input() viewContainerRef: ViewContainerRef | undefined;
  @Output() userSaved = new EventEmitter<UserDTO>();

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
      username: [''],
      ime: [''],
      prezime: [''],
      adresa: [''],
      telefon: [''],
      indeks: [null],
      institucijaId: [null, Validators.required],
      statusId: [null, Validators.required],
      komentar: [''],
      //datum: [null],
    });
  }

  /** Helper: postavi vrednosti u formu na osnovu inputa */
  private patchFormData() {
    const user = this.pgUser();
    //console.log('USER za formu: ' + user);
    console.log('ima li nesto za formu: ' + JSON.stringify(user));
    console.log('Ima li INFO: ' + this.info);
    //console.log('user.status:', user?.status, typeof user?.status);

    if (user) {
      this.form().patchValue({
        id: user.id,
        username: user.username ?? '',
        ime: user.ime ?? '',
        prezime: user.prezime ?? '',
        adresa: user.adresa ?? '',
        telefon: user.telefon ?? '',
        indeks: user.indeks ?? null,
        institucijaId: user.institucija?.id ?? null,
        statusId: user.status?.id ?? null,
        komentar: user.komentar ?? '',
        });
          } else {
      // Novi korisnik: popuni iz LDAP (ili ostavi prazno)
      this.form().patchValue({
        id: null,
        username: (this.username() ?? '').toLowerCase(),   // 👈 pretvori u lowercase
        ime: this.fullname() ?? '',
        prezime: this.lastname() ?? '',
        adresa: '',
        telefon: '',
        indeks: null,
        institucijaId: 8,
        statusId: 2,
        komentar: '',
      });
    }
  }

 /* /!** Helper: pripremi vrednosti za formu *!/
  private buildFormValue() {
    const user = this.pgUser();

    if (user) {
      return {
        id: user.id ?? null,
        username: user.username ?? '',
        ime: user.ime ?? '',
        prezime: user.prezime ?? '',
        adresa: user.adresa ?? '',
        telefon: user.telefon ?? '',
        indeks: user.indeks ?? null,
        institucijaId: user.institucija?.id ?? null,
        statusId: user.status?.id ?? null,
        komentar: user.komentar ?? '',
      };
    } else {
      return {
        id: null,
        username: this.username() ?? '',
        ime: this.fullname() ?? '',
        prezime: this.lastname() ?? '',
        adresa: '',
        telefon: '',
        indeks: null,
        institucijaId: 8,   // tvoj default
        statusId: 2,        // tvoj default
        komentar: '',
      };
    }
  }

  /!** Helper: resetuj celu formu na nove vrednosti *!/
  private resetFormData() {
    this.form().reset(this.buildFormValue(), { emitEvent: false });
    this.form().markAsPristine();
    this.form().markAsUntouched();
  }
*/
  // Submit
  submit() {
    const group = this.form();
    if (group && group.valid) {
      const data = group.value;

      let request$: Observable<UserDTO>;

      if (data.id) {
        // Editovanje korisnika (POSTOJI id)
        request$ = this.pgUserService.updateUser(data);
      } else {
        // Novi korisnik (NE POSTOJI id)
        request$ = this.pgUserService.addUser(data);
      }

      request$.subscribe({
        next: (resp: UserDTO) => {
          this.userSaved.emit(resp);
          this.editMode.set(false);
          group.disable({emitEvent: false});
          this.snackBar.open(
            data.id ? 'Promene sačuvane!' : 'Korisnik dodat!',
            '',
            {
              duration: 2000,
              panelClass: ['snackbar-success'],
              viewContainerRef: this.viewContainerRef,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        },
        error: (err) => {
          this.snackBar.open(err.message, '', {
            duration: 2000,
            panelClass: ['snackbar-error'],
          });
        }
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
    //this.patchFormData(); // Resetuj na vrednosti iz inputa
  }

  compareById = (a: any, b: any) => a && b && a.id === b.id;
  protected readonly isFormControl = isFormControl;
}
