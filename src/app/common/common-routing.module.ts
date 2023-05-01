import { inject, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BlogLoginComponent } from './components/blog-login/blog-login.component'
import { CreatePostComponent } from './components/create-post/create-post.component'
import { PostComponent } from './components/post/post.component'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component'
import { BlogAdminGuard } from '../auth/guards/blog-admin.guard'
import { PdfChatComponent } from './components/pdf-chat/pdf-chat.component'

export const routeComponents = [
  PrivacyPolicyComponent,
  PostComponent,
  CreatePostComponent,
  BlogLoginComponent,
  PdfChatComponent,
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
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CommonRoutingModule {}
