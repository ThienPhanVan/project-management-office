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
export class ProjectWikiService {
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

  getWikis(projectId: string, query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(
      `${URL_PREFIX}/wikis?project_id=${projectId}`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  getWiki(id: string, query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/wikis/${id}`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  addWiki(wiki: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/wikis`, wiki, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a wiki' + error.message);
        })
      );
  }

  updateWiki(wiki: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(`${URL_PREFIX}/wikis/${id}`, wiki, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while updating a wiki ' + error.message);
        })
      );
  }

  createWikiVersion(wiki: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(
        `${URL_PREFIX}/wikis/${id}/versions`,
        wiki,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while updating a wiki ' + error.message);
        })
      );
  }

  deleteWiki(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/wikis/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a wiki ' + error.message);
        })
      );
  }
}
