import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfUploadComponent } from './common/components/pdf-upload/pdf-upload.component';
import { AboutComponent } from './routes/components/about/about.component';
import { DashboardComponent } from './routes/components/dashboard/dashboard.component';
import { LandingComponent } from './routes/components/landing/landing.component';
import { PricingPlanComponent } from './routes/components/pricing-plan/pricing-plan.component';
import { ProfileComponent } from './routes/components/profile/profile.component';
import { UpdateProfileComponent } from './routes/components/update-profile/update-profile.component';

export const routeComponents = [
  ProfileComponent,
  UpdateProfileComponent,
  LandingComponent,
  DashboardComponent,
];

const routes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'update-profile', component: UpdateProfileComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'upload-pdf', component: PdfUploadComponent },
  { path: 'plans', component: PricingPlanComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
