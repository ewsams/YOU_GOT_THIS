import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule, routeComponents } from './auth-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [...routeComponents],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    RouterModule,
  ],
  providers: [],
  exports: [...routeComponents],
})
export class AuthModule {}
