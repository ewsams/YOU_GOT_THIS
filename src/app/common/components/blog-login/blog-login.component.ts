// src/app/components/blog-login/blog-login.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/services/auth.service';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-blog-login',
  templateUrl: './blog-login.component.html',
  styleUrls: ['./blog-login.component.scss'],
})
export class BlogLoginComponent {
  private _store = inject(Store);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  username = '';
  password = '';

  onSubmit(): void {
    const loggedIn = this._authService.loginAsBlogAdmin(
      this.username,
      this.password
    );
    if (loggedIn) {
      this._router.navigate(['/create-post']);
    }
  }
}
