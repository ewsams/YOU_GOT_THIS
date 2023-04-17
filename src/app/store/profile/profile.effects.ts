import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ProfileActions from './profile.actions';
import { ProfileService } from '../../common/services/profile.service';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService
  ) {}

  createProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.createProfile),
      mergeMap(({ userId, profile }) =>
        this.profileService.createProfile(userId, profile).pipe(
          map((profile) => ProfileActions.createProfileSuccess({ profile })),
          catchError((error) =>
            of(ProfileActions.createProfileFailure({ error }))
          )
        )
      )
    )
  );

  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getProfile),
      mergeMap(({ userId }) =>
        this.profileService.getProfile(userId).pipe(
          map((profile) => ProfileActions.getProfileSuccess({ profile })),
          catchError(() => of({ type: '[Profile] Get Profile Error' }))
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      mergeMap(({ userId, profile }) =>
        this.profileService.updateProfile(userId, profile).pipe(
          map((profile) => ProfileActions.updateProfileSuccess({ profile })),
          catchError(() => of({ type: '[Profile] Update Profile Error' }))
        )
      )
    )
  );

  deleteProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.deleteProfile),
      mergeMap(({ userId }) =>
        this.profileService.deleteProfile(userId).pipe(
          map(() => ProfileActions.deleteProfileSuccess()),
          catchError(() => of({ type: '[Profile] Delete Profile Error' }))
        )
      )
    )
  );
}
