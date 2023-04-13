import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/common/services/theme.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  protected themeService = inject(ThemeService);
}
