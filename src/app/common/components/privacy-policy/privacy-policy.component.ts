import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  private _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
}
