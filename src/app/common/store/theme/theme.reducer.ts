import { createReducer, on } from '@ngrx/store';
import { toggleTheme } from './theme.actions';

export interface ThemeState {
  isDarkTheme: boolean;
}

const initialState: ThemeState = {
  isDarkTheme: getThemeFromSessionStorage(),
};

export const themeReducer = createReducer(
  initialState,
  on(toggleTheme, (state) => {
    return { ...state, isDarkTheme: !state.isDarkTheme };
  })
);

function getThemeFromSessionStorage(): boolean {
  const storedTheme = sessionStorage.getItem('theme');
  return storedTheme === 'dark';
}
