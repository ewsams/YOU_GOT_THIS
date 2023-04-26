import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/common/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://you-got-this-ai-node-express-dev.us-west-2.elasticbeanstalk.com/api/auth';
  private currentUserSubjectId: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubjectId = new BehaviorSubject<string>('');
    this.currentUser$ = this.currentUserSubjectId.asObservable();
    this.retrieveUserIdFromSession();
  }

  public get currentUserValue(): string {
    return this.currentUserSubjectId.value;
  }

  public register(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/register`, { email, password })
      .pipe(
        map((user) => {
          if (user && user.accessToken) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubjectId.next(user.userId);
          }
          return user;
        })
      );
  }

  public login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((user) => {
          if (user && user.accessToken) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubjectId.next(user.userId);
          }
          return user;
        })
      );
  }

  public logout(): Observable<Object> {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubjectId.next(null);
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  private retrieveUserIdFromSession(): void {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.currentUserSubjectId.next(parsedUser.userId);
    }
  }
}
