import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICountry } from '../interface/country.interface';
import { Languages } from '../interface/language.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private http: HttpClient) {}

  httpOptions = (token: string) => {
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        }),
      };
    } else {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      };
    }
  };

  getLanguages(): Observable<Array<Languages>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<Languages>>(`${URL_PREFIX}/languages`, {
      ...this.httpOptions(token),
    });
  }
}
