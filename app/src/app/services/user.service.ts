import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ListHistory, ListUsers } from '../interface/user.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1/users';
const URL_MEDIA = 'https://gce.onedev.top/api/media';
const URL_HISTORY = 'https://gce.onedev.top/api/v1/user-histories';
const URL_V1 = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

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

  getUsers(query?: any): Observable<ListUsers> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ListUsers>(
      `${URL_PREFIX}?include=organizations,user_organizations`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  getUsersOrg(query?: any, id?: string): Observable<ListUsers> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ListUsers>(
      `${URL_PREFIX}?organization_id=efe87002-8bc2-4306-9db6-205b487abba6`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  getUsersChapter(query?: any, id?: string): Observable<ListUsers> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ListUsers>(`${URL_PREFIX}?chapter_id=${id}`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getFriends(id: string): Observable<ListUsers> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ListUsers>(`${URL_V1}/friends/${id}/friends`, {
      ...this.httpOptions(token),
    });
  }

  getUser(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/${id}?include=organizations,organizations.industries,chapters,summary`,
      this.httpOptions(token)
    );
  }

  addUser(user: any) {
    return this.http.post(`${URL_PREFIX}`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while creating a user' + error.message);
      })
    );
  }

  updateUser(user: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(`${URL_PREFIX}/${id}`, user, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) this.router.navigate(['login']);

          return throwError('Error while updating a user ' + error.message);
        })
      );
  }

  deleteUser(id: string) {
    return this.http.delete(`${URL_PREFIX}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a user ' + error.message);
      })
    );
  }

  public onFileSelected(file: any, mediaId: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaId', mediaId);

    return this.http
      .post(URL_MEDIA, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while update avatar' + error.message);
        })
      );
  }

  getListHistories(
    limit = 10,
    offset = 0,
    include = ''
  ): Observable<ListHistory> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ListHistory>(
      `${URL_HISTORY}?limit=${limit}&offset=${offset}&include=${include}`,
      this.httpOptions(token)
    );
  }

  getActivitiesProfile(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}/${id}`, this.httpOptions(token));
  }

  searchUsers(query: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}?q=${query}`,
      this.httpOptions(token)
    );
  }

  searchFriends(id: string, query: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_V1}/friends/${id}/friends?q=${query}`,
      this.httpOptions(token)
    );
  }
}
