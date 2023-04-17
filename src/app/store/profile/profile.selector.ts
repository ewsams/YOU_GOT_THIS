import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.reducer';

export const selectProfileFeature =
  createFeatureSelector<ProfileState>('profile');

export const selectProfile = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.profile
);

export const selectProfileLoading = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.loading
);

export const selectProfileError = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.error
);

export const selectProfileCreated = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.profile !== null
);
