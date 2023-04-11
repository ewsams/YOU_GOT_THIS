import { Component, ElementRef, OnInit } from '@angular/core';
import { ThemeService } from './common/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _themeService: ThemeService, private _el: ElementRef) {}

  ngOnInit(): void {
    const body: HTMLBodyElement = this._el.nativeElement.ownerDocument.body;
    const storedTheme = sessionStorage.getItem('theme');

    if (storedTheme) {
      const isLightTheme = storedTheme === 'light';
      this._themeService.updateTheme(isLightTheme);

      if (isLightTheme) {
        body.classList.add('light');
        body.classList.remove('dark');
      } else {
        body.classList.add('dark');
        body.classList.remove('light');
      }
    } else {
      const isLightTheme = body.classList.contains('light');
      this._themeService.updateTheme(isLightTheme);
      sessionStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    }
  }
}
