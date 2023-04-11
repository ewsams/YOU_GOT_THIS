import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdfTokenCount } from '../models/pdf-token-count.model';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private _http: HttpClient) {}

  public countTokensWithEncoding(
    text: string,
    encoding_name: string
  ): Observable<PdfTokenCount> {
    return this._http.post<PdfTokenCount>(`${this.apiUrl}/api/count-tokens`, {
      text,
      encoding_name,
    });
  }
}
