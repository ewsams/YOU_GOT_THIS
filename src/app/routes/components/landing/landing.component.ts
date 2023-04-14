import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/common/store/theme/theme.selectors';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
}
