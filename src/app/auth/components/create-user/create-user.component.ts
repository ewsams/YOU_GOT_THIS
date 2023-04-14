import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { clearError, register } from '../../store/auth.actions';
import { selectErrorMessage } from '../../store/auth.selectors';
import { selectIsDarkTheme } from 'src/app/common/store/theme/theme.selectors';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  public registerForm: FormGroup | undefined;
  private _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  private _formBuilder = inject(FormBuilder);
  public errorMessage$ = this._store.select(selectErrorMessage);

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm?.invalid) {
      return;
    }

    const { email, password } = this.registerForm?.value;

    this._store.dispatch(register({ email, password }));
  }

  ngOnDestroy(): void {
    this._store.dispatch(clearError());
  }
}
