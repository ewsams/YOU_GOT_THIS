import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public theme$ = this._theme.asObservable();

  public updateTheme(currentTheme: boolean): void {
    this._theme.next(currentTheme);
  }

  public get currentTheme(): boolean {
    return this._theme.value;
  }

  public toggleTheme(): void {
    const currentTheme = this._theme.value;
    this._theme.next(!currentTheme);
  }
}
