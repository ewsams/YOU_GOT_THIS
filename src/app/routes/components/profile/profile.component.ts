import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { tap, switchMap, timer, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { ProfileService } from 'src/app/common/services/profile.service';
import { selectUser } from 'src/app/store/auth/auth.selectors';
import { SubResolver } from 'src/app/common/helpers/sub-resolver';
import { createProfile } from 'src/app/store/profile/profile.actions';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends SubResolver implements OnInit {
  public profileForm: FormGroup | undefined;
  public currentStep = 1;
  public imagePreview: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;
  private formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);

  private _router = inject(Router);
  private _userId: string | undefined;
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

    this._store
      .select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this._userId = user.userId;
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

    if (this._userId && this.profileForm?.valid) {
      this._store.dispatch(
        createProfile({
          userId: this._userId as string,
          profile: formData,
        })
      );
      this._router.navigate(['/dashboard']);
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
