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
export class ProjectService {
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

  getProjects(query?: any): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_PREFIX}/projects`, {
      ...this.httpOptions(token),
      params: query,
    });
  }

  getProject(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/projects/${id}`,
      this.httpOptions(token)
    );
  }
  getTotalIssuesByUser(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/projects/${id}/total-issues-by-user`,
      this.httpOptions(token)
    );
  }
  addProject(project: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/projects`, project, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a project' + error.message);
        })
      );
  }

  updateProject(project: any, id: string): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}/projects/${id}`, project).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.errorHandler.log("Error while updating a Project", error);
        console.log(error.message);
        return throwError('Error while updating a Project ' + error.message);
      })
    );
  }

  deleteProject(id: string) {
    return this.http.delete(`${URL_PREFIX}/projects/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a Project ' + error.message);
      })
    );
  }
}
