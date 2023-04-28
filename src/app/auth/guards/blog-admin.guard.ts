import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlogAdminGuard {
  private isLoggedIn: boolean | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    this.authService.isAdminLoggedIn$
      .pipe(take(1))
      .subscribe((loggedIn) => (this.isLoggedIn = loggedIn));
    if (!this.isLoggedIn) {
      this.router.navigate(['/blog-admin']);
      return false;
    }
    return true;
  }
}
