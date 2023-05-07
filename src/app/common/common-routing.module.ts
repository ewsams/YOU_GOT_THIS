import { inject, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BlogLoginComponent } from './components/blog-login/blog-login.component'
import { CreatePostComponent } from './components/create-post/create-post.component'
import { PostComponent } from './components/post/post.component'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component'
import { BlogAdminGuard } from '../auth/guards/blog-admin.guard'
import { PdfChatComponent } from './components/pdf-chat/pdf-chat.component'
import { AudioChatComponent } from './components/audio-chat/audio-chat.component'
import { LoginGuard } from '../auth/guards/login-guard.guard'

export const routeComponents = [
  PrivacyPolicyComponent,
  PostComponent,
  CreatePostComponent,
  BlogLoginComponent,
  PdfChatComponent,
  AudioChatComponent,
]

export const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'news', component: PostComponent },
  {
    path: 'blog-admin',
    component: BlogLoginComponent,
  },
  {
    path: 'create-post',
    component: CreatePostComponent,
    canActivate: [() => inject(BlogAdminGuard).canActivate()],
  },
  {
    path: 'pdf-chat',
    component: PdfChatComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
  },
  {
    path: 'audio-chat',
    component: AudioChatComponent,
    canActivate: [() => inject(LoginGuard).canActivate()],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CommonRoutingModule {}
