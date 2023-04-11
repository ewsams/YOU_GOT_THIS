import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PdfUploadComponent } from './components/pdf-upload/pdf-upload.component';

const components = [HeaderComponent, FooterComponent, PdfUploadComponent];

@NgModule({
  declarations: [...components],
  imports: [BrowserModule, CommonModule, RouterModule, FormsModule],
  exports: [...components],
})
export class CommonUtilModule {}
