import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  chartData = [
    { name: 'PDF 1', value: 15 },
    { name: 'PDF 2', value: 25 },
    { name: 'PDF 3', value: 35 },
    { name: 'PDF 4', value: 45 },
    { name: 'PDF 5', value: 55 },
  ];
}
