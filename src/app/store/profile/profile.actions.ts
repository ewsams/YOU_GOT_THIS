import { createAction, props } from '@ngrx/store';
import { Profile } from '../../common/models/profile.model';

export const createProfile = createAction(
  '[Profile] Create Profile',
  props<{ userId: string; profile: FormData }>()
);

export const createProfileSuccess = createAction(
  '[Profile] Create Profile Success',
  props<{ profile: Profile }>()
);

export const createProfileFailure = createAction(
  '[Profile] Create Profile Failure',
  props<{ error: string }>()
);

export const getProfile = createAction(
  '[Profile] Get Profile',
  props<{ userId: string }>()
);

export const getProfileSuccess = createAction(
  '[Profile] Get Profile Success',
  props<{ profile: Profile }>()
);

export const getProfileFailure = createAction(
  '[Profile] Get Profile Failure',
  props<{ error: string }>()
);

export const updateProfile = createAction(
  '[Profile] Update Profile',
  props<{ userId: string; profile: FormData }>()
);

export const updateProfileSuccess = createAction(
  '[Profile] Update Profile Success',
  props<{ profile: Profile }>()
);

export const updateProfileFailure = createAction(
  '[Profile] Update Profile Failure',
  props<{ error: string }>()
);

export const deleteProfile = createAction(
  '[Profile] Delete Profile',
  props<{ userId: string }>()
);

export const deleteProfileSuccess = createAction(
  '[Profile] Delete Profile Success'
);

export const deleteProfileFailure = createAction(
  '[Profile] Delete Profile Failure',
  props<{ error: string }>()
);
