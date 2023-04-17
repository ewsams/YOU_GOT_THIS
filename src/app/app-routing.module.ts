import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfUploadComponent } from './common/components/pdf-upload/pdf-upload.component';
import { AboutComponent } from './routes/components/about/about.component';
import { DashboardComponent } from './routes/components/dashboard/dashboard.component';
import { LandingComponent } from './routes/components/landing/landing.component';
import { PricingPlanComponent } from './routes/components/pricing-plan/pricing-plan.component';
import { ProfileComponent } from './routes/components/profile/profile.component';
import { UpdateProfileComponent } from './routes/components/update-profile/update-profile.component';
import { LoginGuard } from 'src/app/auth/guards/login-guard.guard';
import { StripePaymentComponent } from './routes/components/stripe-payment/stripe-payment.component';

export const routeComponents = [
  ProfileComponent,
  UpdateProfileComponent,
  LandingComponent,
  DashboardComponent,
  PricingPlanComponent,
  AboutComponent,
  StripePaymentComponent,
];

const routes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'plans', component: PricingPlanComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
  },
  {
    path: 'upload-pdf',
    component: PdfUploadComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
