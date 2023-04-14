import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { tap, switchMap, timer } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { ProfileService } from 'src/app/common/services/profile.service';
import { selectIsDarkTheme } from 'src/app/common/store/theme/theme.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup | undefined;
  public currentStep = 1;
  public imagePreview: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;
  private _profileService = inject(ProfileService);
  private formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  public profileCreated = false;
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
          .createProfile(this._authService.currentUserValue, formData)
          .pipe(
            // Set profileUpdated to true
            tap(() => {
              this.profileCreated = true;
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
              console.log('Profile created:', response);
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
