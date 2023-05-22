import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { User } from 'src/app/common/models/user.model'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.nodeUrl + '/api/auth'
  private currentUserSubjectId: BehaviorSubject<any>
  public currentUser$: Observable<any>

  private _isAdminLoggedIn = new BehaviorSubject<boolean>(false)
  public isAdminLoggedIn$ = this._isAdminLoggedIn.asObservable()

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubjectId = new BehaviorSubject<string>('')
    this.currentUser$ = this.currentUserSubjectId.asObservable()
    this.retrieveUserIdFromSession()
  }

  public get currentUserValue(): string {
    return this.currentUserSubjectId.value
  }

  public register(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { email, password }).pipe(
      map((user) => {
        if (user && user.accessToken) {
          sessionStorage.setItem('currentUser', JSON.stringify(user))
          this.currentUserSubjectId.next(user.userId)
        }
        return user
      }),
    )
  }

  public login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((user) => {
        if (user && user.accessToken) {
          sessionStorage.setItem('currentUser', JSON.stringify(user))
          this.currentUserSubjectId.next(user.userId)
        }
        this.router.navigate(['/dashboard'])
        return user
      }),
    )
  }

  public logout(): Observable<Object> {
    sessionStorage.removeItem('currentUser')
    this.currentUserSubjectId.next(null)
    return this.http.post(`${this.apiUrl}/logout`, {})
  }

  private retrieveUserIdFromSession(): void {
    const storedUser = sessionStorage.getItem('currentUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      this.currentUserSubjectId.next(parsedUser.userId)
    }
  }

  public loginAsBlogAdmin(username: string, password: string): boolean {
    if (username === 'edward' && password === 'admin') {
      this._isAdminLoggedIn.next(true)
      return true
    }
    return false
  }

  public logoutAdmin(): void {
    this._isAdminLoggedIn.next(false)
  }
}
