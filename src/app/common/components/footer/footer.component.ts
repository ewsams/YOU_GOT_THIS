import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';
import { FooterCategorySection } from '../../models/footer-category-section';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  public categorySections: Array<FooterCategorySection> = [
    {
      title: 'CATEGORIES',
      links: [
        { label: 'First Link', path: '#' },
        { label: 'Second Link', path: '#' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
      ],
    },
    {
      title: 'CATEGORIES',
      links: [
        { label: 'First Link', path: '#' },
        { label: 'Second Link', path: '#' },
        { label: 'Third Link', path: '#' },
      ],
    },
    {
      title: 'CATEGORIES',
      links: [
        { label: 'First Link', path: '#' },
        { label: 'Second Link', path: '#' },
        { label: 'Third Link', path: '#' },
      ],
    },
  ];

  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
