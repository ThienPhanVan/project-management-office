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
export class ShortcutsService {
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

  getShortcuts(): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_PREFIX}/shortcuts`, {
      ...this.httpOptions(token),
    });
  }

  getPriority(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/shortcuts/${id}`, {
      ...this.httpOptions(token),
      params: { include: 'project' },
    });
  }

  addPriority(milestone: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/shortcuts`, milestone, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a milestone' + error.message);
        })
      );
  }

  updatePriority(milestone: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(
        `${URL_PREFIX}/shortcuts/${id}`,
        milestone,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a milestone", error);
          console.log(error.message);
          return throwError(
            'Error while updating a milestone ' + error.message
          );
        })
      );
  }

  deletePriority(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/shortcuts/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while deleting a milestone ' + error.message
          );
        })
      );
  }
}
