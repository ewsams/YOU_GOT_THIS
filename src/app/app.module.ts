import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routeComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CommonUtilModule } from './common/common-util.module';
import { DashboardComponent } from './routes/components/dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PricingPlanComponent } from './routes/components/pricing-plan/pricing-plan.component';
import { AboutComponent } from './routes/components/about/about.component';

@NgModule({
  declarations: [AppComponent, ...routeComponents, DashboardComponent, PricingPlanComponent, AboutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    AuthModule,
    CommonUtilModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
