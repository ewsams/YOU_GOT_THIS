import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = 'http://' + environment.nodeUrl + '/api/profile';

  constructor(private _http: HttpClient) {}

  public createProfile(userId: string, profile: FormData): Observable<Profile> {
    return this._http.post<Profile>(`${this.apiUrl}/${userId}`, profile);
  }

  public getProfile(userId: string): Observable<Profile> {
    return this._http.get<Profile>(`${this.apiUrl}/${userId}`);
  }

  public updateProfile(userId: string, profile: FormData): Observable<Profile> {
    return this._http.put<Profile>(`${this.apiUrl}/${userId}`, profile);
  }

  public deleteProfile(userId: string): Observable<any> {
    return this._http.delete(`${this.apiUrl}/${userId}`);
  }
}
