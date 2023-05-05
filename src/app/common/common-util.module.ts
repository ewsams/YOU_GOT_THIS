import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { CommonRoutingModule, routeComponents } from './common-routing.module'
import { FooterComponent } from './components/footer/footer.component'
import { HeaderComponent } from './components/header/header.component'
import { PdfUploadComponent } from './components/pdf-upload/pdf-upload.component'
import { BlogLoginComponent } from './components/blog-login/blog-login.component'
import { PdfChatComponent } from './components/pdf-chat/pdf-chat.component'
import { AudioChatComponent } from './components/audio-chat/audio-chat.component'

const components = [HeaderComponent, FooterComponent, PdfUploadComponent]

@NgModule({
  declarations: [...components, ...routeComponents],
  imports: [BrowserModule, RouterModule, FormsModule, CommonRoutingModule],
  exports: [...components, ...routeComponents],
})
export class CommonUtilModule {}
