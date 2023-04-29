import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../models/blog-post.model';
import { BlogPostService } from '../../services/blog-post.service';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  public blogPosts: Array<BlogPost> | undefined;
  private _store = inject(Store);
  public isDarkTheme$ = this._store.select(selectIsDarkTheme);

  constructor(
    private blogPostService: BlogPostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.blogPostService.getBlogPosts().subscribe({
      next: (data) => {
        this.blogPosts = data;
      },
      error: (error) => {
        console.error('Error fetching blog post:', error);
      },
    });
  }
}
