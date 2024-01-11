import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IIssue } from '../interface/issue.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
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

  getIssues(query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';

    return this.http.get<Array<IIssue>>(`${URL_PREFIX}/issues`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getIssue(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/issues/${id}`, {
      ...this.httpOptions(token),
      params: { include: 'project,milestone,status,version,priority,assignee' },
    });
  }

  addIssue(issue: IIssue) {
    const token = localStorage.getItem('access_token') || '';
    console.log(issue, 'issues');

    return this.http
      .post(`${URL_PREFIX}/issues`, issue, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a issue' + error.message);
        })
      );
  }

  updateIssue(issue: IIssue, id: string): Observable<IIssue> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<IIssue>(`${URL_PREFIX}/issues/${id}`, issue, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a issue", error);
          console.log(error.message);
          return throwError('Error while updating a issue ' + error.message);
        })
      );
  }

  deleteIssue(id: string) {
    return this.http.delete(`${URL_PREFIX}/issues/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a issue ' + error.message);
      })
    );
  }
}
