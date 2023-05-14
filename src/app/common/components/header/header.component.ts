import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subscription, takeUntil } from 'rxjs'
import { logout } from 'src/app/store/auth/auth.actions'
import { selectUserId, selectUser } from 'src/app/store/auth/auth.selectors'
import { getProfile } from 'src/app/store/profile/profile.actions'
import { selectProfile, selectProfileLoading, selectProfileError } from 'src/app/store/profile/profile.selector'
import { toggleTheme } from 'src/app/store/theme/theme.actions'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { SubResolver } from '../../helpers/sub-resolver'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends SubResolver implements OnInit {
  private _store = inject(Store)
  public profile$ = this._store.select(selectProfile)
  public userId$ = this._store.select(selectUserId)
  public currentUser$ = this._store.select(selectUser)
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public loading$ = this._store.select(selectProfileLoading)
  public error$ = this._store.select(selectProfileError)
  public isDropdownOpen = false

  public toggleTheme(): void {
    this._store.dispatch(toggleTheme())
  }

  public signOut(): void {
    this._store.dispatch(logout())
  }

  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  ngOnInit(): void {
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((userId) => {
      if (userId) {
        this._store.dispatch(getProfile({ userId }))
      } else {
        this.isDropdownOpen = false
      }
    })
  }
}
