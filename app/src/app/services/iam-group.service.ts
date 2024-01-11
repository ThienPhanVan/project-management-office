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
export class IAMGroupService {
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

  getGroups(query?: any): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_PREFIX}/iam-groups`, {
      ...this.httpOptions(token),
      params: query,
    });
  }

  getGroup(id: string): Observable<any> {
    return this.http.get<any>(`${URL_PREFIX}/iam-groups/${id}`);
  }

  addGroup(group: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/iam-groups`, group, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a group' + error.message);
        })
      );
  }

  updateGroup(group: any, id: string): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}/iam-groups/${id}`, group).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while updating a group ' + error.message);
      })
    );
  }

  deleteGroup(id: string) {
    return this.http.delete(`${URL_PREFIX}/iam-groups/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a group ' + error.message);
      })
    );
  }
}
