import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SubResolver } from 'src/app/common/helpers/sub-resolver';
import { Profile } from 'src/app/common/models/profile.model';
import { ProfileService } from 'src/app/common/services/profile.service';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/common/store/theme/theme.selectors';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent extends SubResolver implements OnInit {
  public profileForm: FormGroup | undefined;
  public currentStep = 1;
  public imagePreview: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;
  private _profileService = inject(ProfileService);
  private formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  public userId: string | undefined;
  public currentUserProfile: Profile | undefined;
  public profileUpdated = false;
  protected _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);

  public tabs = [
    {
      text: 'Profile Image',
    },
    {
      text: 'Name',
    },
    {
      text: 'Bio',
    },
    {
      text: 'Location',
    },
  ];

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      profileImage: [''],
      name: ['', Validators.required],
      bio: [''],
      location: [''],
    });

    this._authService.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        tap((user) => {
          if (user) {
            this.userId = user;
          }
        }),
        switchMap((userId) =>
          this._profileService.getProfile(userId as string)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((profile) => {
        if (profile) {
          this.currentUserProfile = profile;
          this.profileForm?.patchValue(profile);
        }
      });
  }

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreview = this._sanitizer.bypassSecurityTrustUrl(
          e.target.result
        ) as string;
      };

      reader.readAsDataURL(file);
    }
  }

  public onSubmit(): void {
    if (this.currentStep < 4) {
      this.goToNextStep();
    } else {
      if (this.profileForm?.invalid) {
        return;
      }

      const formData = new FormData();
      formData.append('name', this.profileForm?.controls['name'].value);
      formData.append('bio', this.profileForm?.controls['bio'].value);
      formData.append('location', this.profileForm?.controls['location'].value);

      if (this.selectedFile) {
        formData.append(
          'profileImage',
          this.selectedFile,
          this.selectedFile.name
        );
      }

      if (this._authService.currentUserValue) {
        this._profileService
          .updateProfile(this._authService.currentUserValue, formData)
          .pipe(
            // Set profileUpdated to true
            tap(() => {
              this.profileUpdated = true;
            }),
            // Add a delay using the timer function
            switchMap(() => timer(2000)),
            // Perform navigation after the delay
            tap(() => {
              this._router.navigate(['/dashboard']);
            })
          )
          .subscribe({
            next: (response) => {
              console.log('Updated profile:', response);
            },
            error: (error) => {
              console.log('Error creating profile:', error);
            },
          });
      }
    }
  }

  public goToNextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  public goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
