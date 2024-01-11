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
export class ProjectPrioritiesService {
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

  getPriorities(projectId: string, query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(
      `${URL_PREFIX}/priorities?project_id=${projectId}`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  getPriority(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/issue-priorities/${id}`, {
      ...this.httpOptions(token),
      params: { include: 'project' },
    });
  }

  addPriority(priority: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/issue-priorities`, priority, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a priority' + error.message);
        })
      );
  }

  updatePriority(priority: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(
        `${URL_PREFIX}/issue-priorities/${id}`,
        priority,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a priority", error);
          console.log(error.message);
          return throwError('Error while updating a priority ' + error.message);
        })
      );
  }

  deletePriority(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/issue-priorities/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a priority ' + error.message);
        })
      );
  }
}
