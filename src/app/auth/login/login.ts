import { Component, inject } from '@angular/core';
import { authService } from '../service/authService'; // Importuj svoj servis!
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    MatCard,
    MatButton,
    MatInput,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
  ]
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(authService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMsg = '';

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.auth.login(username ?? '', password ?? '').subscribe(success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = 'Pogrešan username ili password!';
        }
      });
    }
  }
}
