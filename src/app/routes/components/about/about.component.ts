import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
}
