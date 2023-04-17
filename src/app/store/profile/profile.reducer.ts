import { createReducer, on, Action } from '@ngrx/store';
import { Profile } from '../../common/models/profile.model';
import * as ProfileActions from './profile.actions';

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileReducer = createReducer(
  initialProfileState,
  on(ProfileActions.createProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.createProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ProfileActions.createProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProfileActions.getProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.getProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ProfileActions.getProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProfileActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ProfileActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProfileActions.deleteProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.deleteProfileSuccess, (state) => ({
    ...state,
    profile: null,
    loading: false,
  })),
  on(ProfileActions.deleteProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export function reducer(state: ProfileState | undefined, action: Action) {
  return profileReducer(state, action);
}
