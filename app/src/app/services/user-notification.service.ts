import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
const URL_USER_NOTIFICATIONS =
  'https://gce.onedev.top/api/v1/user-notifications';
@Injectable({
  providedIn: 'root',
})
export class UserNotificationService {
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

  getListUserNotification(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_USER_NOTIFICATIONS}?include=notification`,
      { ...this.httpOptions(token), params: query || {} }
    );
  }

  removeUserNotification(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_USER_NOTIFICATIONS}/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  updateStatusUserNotification(query: any, id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(`${URL_USER_NOTIFICATIONS}/${id}`, query, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  markAllAsRead() {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(
        `${URL_USER_NOTIFICATIONS}/mark-all-as-read`,
        {},
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  numberOfUnread() {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(
        `${URL_USER_NOTIFICATIONS}/number-of-unread`,
        {},
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }
}
