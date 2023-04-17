import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from 'src/app/store/auth/auth.reducer';
import { profileReducer, ProfileState } from '../profile/profile.reducer';
import { ThemeState, themeReducer } from '../theme/theme.reducer';

export interface State {
  auth: AuthState;
  theme: ThemeState;
  profile: ProfileState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  theme: themeReducer,
  profile: profileReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
