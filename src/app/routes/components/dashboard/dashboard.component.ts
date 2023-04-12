import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/common/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  protected themeService = inject(ThemeService);
  chartData = [
    { name: 'PDF 1', value: 15 },
    { name: 'PDF 2', value: 25 },
    { name: 'PDF 3', value: 35 },
    { name: 'PDF 4', value: 45 },
    { name: 'PDF 5', value: 55 },
  ];
}
