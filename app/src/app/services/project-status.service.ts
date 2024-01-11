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
export class ProjectStatusService {
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

  getStatuses(projectId: string, query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(
      `${URL_PREFIX}/statuses?project_id=${projectId}`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  getStatus(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/statuses/${id}`, {
      ...this.httpOptions(token),
      params: { include: 'project' },
    });
  }

  addStatus(status: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/statuses`, status, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a status' + error.message);
        })
      );
  }

  updateStatus(status: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(`${URL_PREFIX}/statuses/${id}`, status, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a status", error);
          console.log(error.message);
          return throwError('Error while updating a status ' + error.message);
        })
      );
  }

  deleteStatus(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/statuses/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a status ' + error.message);
        })
      );
  }
}
