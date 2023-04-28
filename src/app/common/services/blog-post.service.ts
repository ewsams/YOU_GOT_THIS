import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private readonly apiUrl = environment.nodeUrl + '/api/blogposts';

  constructor(private _http: HttpClient) {}

  public getBlogPosts(): Observable<Array<BlogPost>> {
    return this._http.get<Array<BlogPost>>(this.apiUrl);
  }

  public getBlogPost(id: string): Observable<BlogPost> {
    return this._http.get<BlogPost>(`${this.apiUrl}/${id}`);
  }

  public createBlogPost(blogPost: BlogPost): Observable<BlogPost> {
    const formData = new FormData();
    formData.append('title', blogPost.title);
    formData.append('content', blogPost.content);
    formData.append('author', blogPost.author);
    for (const image of blogPost.images) {
      formData.append('images', image);
    }

    return this._http.post<BlogPost>(this.apiUrl, formData);
  }

  public updateBlogPost(
    id: string,
    blogPost: Partial<BlogPost>
  ): Observable<BlogPost> {
    return this._http.put<BlogPost>(`${this.apiUrl}/${id}`, blogPost);
  }

  public deleteBlogPost(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
