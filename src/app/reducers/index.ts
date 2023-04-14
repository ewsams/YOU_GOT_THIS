import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store/auth.reducer';
import { themeReducer, ThemeState } from '../common/store/theme/theme.reducer';

export interface State {
  auth: AuthState;
  theme: ThemeState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  theme: themeReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
