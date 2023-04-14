import { Component, inject, OnInit } from '@angular/core';
import { EMPTY, Observable, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SubResolver } from '../../helpers/sub-resolver';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/auth/store/auth.actions';
import { selectUser, selectUserId } from 'src/app/auth/store/auth.selectors';
import { User } from '../../models/user.model';
import { selectIsDarkTheme } from '../../store/theme/theme.selectors';
import { toggleTheme } from '../../store/theme/theme.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends SubResolver implements OnInit {
  protected authService = inject(AuthService);
  private _profileService = inject(ProfileService);
  public profile: Profile | undefined;
  public userId: string | null | undefined;
  private _store = inject(Store);
  public currentUser$: Observable<User | null> | undefined;
  public isDarkTheme$: Observable<boolean> | undefined;
  public userId$: Observable<string | null> | undefined;

  public toggleTheme(): void {
    this._store.dispatch(toggleTheme());
  }

  public signOut(): void {
    this._store.dispatch(logout());
  }

  ngOnInit(): void {
    // Get the stored user from sessionStorage and set the userId
    this.currentUser$ = this._store.select(selectUser);
    this.userId$ = this._store.select(selectUserId);
    this.isDarkTheme$ = this._store.select(selectIsDarkTheme);

    // Subscribe to the authService.currentUser observable

    this.userId$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((userId) => {
          return userId ? this._profileService.getProfile(userId) : EMPTY;
        })
      )
      .subscribe((profile) => {
        if (profile) {
          this.profile = profile;
        }
      });
  }
}
