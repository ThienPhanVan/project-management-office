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
export class SearchHistoriesService {
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

  getSearchHistories(params?: any): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_PREFIX}/search-histories`, {
      ...this.httpOptions(token),
      params,
    });
  }

  getSearchHistory(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/search-histories/${id}`,
      this.httpOptions(token)
    );
  }

  addSearchHistory(SearchHistory: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_PREFIX}/search-histories`,
        SearchHistory,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a SearchHistory' + error.message
          );
        })
      );
  }

  updateSearchHistory(SearchHistory: any, id: string): Observable<any> {
    return this.http
      .put<any>(`${URL_PREFIX}/search-histories/${id}`, SearchHistory)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a SearchHistory", error);
          console.log(error.message);
          return throwError(
            'Error while updating a SearchHistory ' + error.message
          );
        })
      );
  }

  deleteSearchHistory(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/search-histories/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while deleting a SearchHistory ' + error.message
          );
        })
      );
  }
}
