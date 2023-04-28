import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../models/blog-post.model';
import { BlogPostService } from '../../services/blog-post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  public blogPosts: Array<BlogPost> | undefined;

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
