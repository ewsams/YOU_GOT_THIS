import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogLoginComponent } from './components/blog-login/blog-login.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostComponent } from './components/post/post.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { BlogAdminGuard } from '../auth/guards/blog-admin.guard';

export const routeComponents = [
  PrivacyPolicyComponent,
  PostComponent,
  CreatePostComponent,
  BlogLoginComponent,
];

export const routes: Routes = [
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'blog', component: PostComponent },
  {
    path: 'blog-admin',
    component: BlogLoginComponent,
  },
  {
    path: 'create-post',
    component: CreatePostComponent,
    canActivate: [() => inject(BlogAdminGuard).canActivate()],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CommonRoutingModule {}
