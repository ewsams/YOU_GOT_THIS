import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from 'src/app/common/models/user.model';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user: User | null) => !!user
);

export const selectErrorMessage = createSelector(
  selectAuthState,
  (state: AuthState) => state.errorMessage || null
);

export const selectUserId = createSelector(selectUser, (user: User | null) =>
  user ? user.userId : null
);
