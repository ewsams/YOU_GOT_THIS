import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';
import { BlogPost } from '../../models/blog-post.model';
import { BlogPostService } from '../../services/blog-post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  private _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);
  private _postService = inject(BlogPostService);
  private _router = inject(Router);
  blogPost: BlogPost = {
    title: '',
    author: '',
    content: '',
    images: [],
  };
  imagePreviews: string[] = [];

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      for (let i = 0; i < target.files.length; i++) {
        this.blogPost.images.push(target.files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(target.files[i]);
      }
    }
  }

  onSubmit() {
    this._postService.createBlogPost(this.blogPost).subscribe({
      next: (createdPost) => {
        console.log('Post created:', createdPost);
        // Clear the form and reset the imagePreviews array
        this.blogPost = { title: '', author: '', content: '', images: [] };
        this.imagePreviews = [];
        // Display a success message to the user
        alert('Blog post created successfully!');
        this._router.navigate(['blog']);
      },
      error: (error) => {
        console.error('Error creating blog post:', error);
        alert('Failed to create blog post. Please try again.');
      },
    });
  }
}
