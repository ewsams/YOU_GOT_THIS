import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { SubResolver } from 'src/app/common/helpers/sub-resolver';
import { ThemeService } from 'src/app/common/services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent extends SubResolver implements OnInit {
  public registerForm: FormGroup | undefined;
  public errorMessage: string | null = null;
  protected themeService = inject(ThemeService);
  private _authService = inject(AuthService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);

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

    this._authService
      .register(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          // Handle successful registration
          console.log('Registered successful');
          this.errorMessage = null;
          this._router.navigate(['/profile']);
        },
        error: (e) => {
          // Handle error
          console.log(e.error.message, e);
          this.errorMessage = e.error.message;
        },
      });
  }
}
