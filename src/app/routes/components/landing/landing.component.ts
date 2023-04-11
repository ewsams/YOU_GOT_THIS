import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/common/services/theme.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  protected themeService = inject(ThemeService);
}
