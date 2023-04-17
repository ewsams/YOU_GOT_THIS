import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  public categorySections: { title: string; links: string[] }[] = [
    {
      title: 'CATEGORIES',
      links: ['First Link', 'Second Link', 'Third Link', 'Fourth Link'],
    },
    {
      title: 'CATEGORIES',
      links: ['First Link', 'Second Link', 'Third Link', 'Fourth Link'],
    },
    {
      title: 'CATEGORIES',
      links: ['First Link', 'Second Link', 'Third Link', 'Fourth Link'],
    },
  ];
}
