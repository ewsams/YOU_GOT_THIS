import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/common/services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup | undefined;
  public errorMessage: string = '';
  protected themeService = inject(ThemeService);
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

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

    this._authService.login(email, password).subscribe({
      next: () => {
        this._router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      },
    });
  }
}
