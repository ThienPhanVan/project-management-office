import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class DailyService {
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

  getDailies(params?: any): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_PREFIX}/dailies`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  getDaily(id: string, params?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/dailies/${id}`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  addDaily(daily: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/dailies`, daily, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Daily' + error.message);
        })
      );
  }

  updateDaily(daily: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(`${URL_PREFIX}/dailies/${id}`, daily, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a daily", error);
          console.log(error.message);
          return throwError('Error while updating a daily ' + error.message);
        })
      );
  }

  deleteDaily(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/dailies/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a daily ' + error.message);
        })
      );
  }
}
