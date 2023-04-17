import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login, clearError } from 'src/app/store/auth/auth.actions';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';
import { selectErrorMessage } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup | undefined;
  private _formBuilder = inject(FormBuilder);
  private _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  public errorMessage$ = this._store.select(selectErrorMessage);

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
    if (this.loginForm?.invalid) {
      return;
    }

    const email = this.loginForm?.get('email')?.value;
    const password = this.loginForm?.get('password')?.value;
    this._store.dispatch(login({ email, password }));
  }

  ngOnDestroy(): void {
    this._store.dispatch(clearError());
  }
}
