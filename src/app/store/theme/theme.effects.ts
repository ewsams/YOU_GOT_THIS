import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { toggleTheme } from './theme.actions';

@Injectable()
export class ThemeEffects {
  private _renderer: Renderer2;

  constructor(private actions$: Actions, rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);

    // Get the stored theme from localStorage and apply the appropriate class to the body
    const storedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    this._renderer.removeClass(
      body,
      storedTheme === 'light' ? 'dark' : 'light'
    );
    this._renderer.addClass(body, storedTheme);
  }

  updateTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleTheme),
        map(() => {
          const body = document.body;
          const isDarkTheme = body.classList.contains('dark');
          const newTheme = isDarkTheme ? 'light' : 'dark';
          localStorage.setItem('theme', newTheme);
          this._renderer.removeClass(body, isDarkTheme ? 'dark' : 'light');
          this._renderer.addClass(body, newTheme);
        })
      ),
    { dispatch: false }
  );
}
