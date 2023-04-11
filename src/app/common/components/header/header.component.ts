import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SubResolver } from '../../helpers/sub-resolver';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends SubResolver implements OnInit {
  public currentTheme!: boolean;
  protected themeService = inject(ThemeService);
  protected authService = inject(AuthService);
  private _profileService = inject(ProfileService);
  private _renderer = inject(Renderer2);
  private _el = inject(ElementRef);
  private _router = inject(Router);
  public profile: Profile | undefined;
  public userId: string | undefined;
  public currentUser$ = this.authService.currentUser$;

  public toggleTheme(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = !theme;
      const body = this._el.nativeElement.ownerDocument.body;
      const className = theme ? 'dark' : 'light';
      sessionStorage.setItem('theme', className);
      this._renderer.removeClass(
        body,
        className === 'light' ? 'dark' : 'light'
      );
      this._renderer.addClass(body, className);
    });
    this.themeService.updateTheme(this.currentTheme);
  }

  public signOut(): void {
    this.profile = undefined;
    this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe();
    this._router.navigate(['/home']);
  }

  ngOnInit(): void {
    // Get the stored user from sessionStorage and set the userId
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.userId = user;
        }
      });

    // Subscribe to the authService.currentUser observable
    this.authService.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.userId
            ? this._profileService.getProfile(this.userId)
            : EMPTY;
        })
      )
      .subscribe((profile) => {
        if (profile) {
          this.profile = profile;
        }
      });

    this.toggleTheme();
  }
}
