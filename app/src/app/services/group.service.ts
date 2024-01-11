import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
const URL_MESSAGE = 'https://gce.onedev.top/api/v1/messages';
const URL_MESSAGE_READ = 'https://gce.onedev.top/api/v1/messages-user-reads';
const URL_GROUPS = 'https://gce.onedev.top/api/v1/message-groups';
const URL_GROUPS_USER = 'https://gce.onedev.top/api/v1/messages-group-users';

const URL_HIDDEN_GROUPS = 'https://gce.onedev.top/api/v1/hidden-message-groups';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
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

  createGroup(params: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_GROUPS}`, params, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a new group' + error.message);
        })
      );
  }

  readMessage(params: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(
      `${URL_MESSAGE_READ}`,
      params,
      this.httpOptions(token)
    );
  }

  changeGroupName(id: string, newName: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const body = { name: newName };
    return this.http
      .put(`${URL_GROUPS}/${id}`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while change a name group' + error.message);
        })
      );
  }

  getListGroups(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_GROUPS}`, {
      ...this.httpOptions(token),
    });
  }

  getGroupById(id: string): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_GROUPS}/${id}`, {
      ...this.httpOptions(token),
    });
  }

  getMessage(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_MESSAGE}`, {
      ...this.httpOptions(token),
    });
  }

  getLatestMessage(id: string, query?: any): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';

    if (query && query.status !== undefined) {
      query = { ...query, status: query.status.toString() };
    }

    return this.http.get<Array<any>>(
      `${URL_MESSAGE}/latest?include=user&user_id=${id}`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  inviteUserToGroup(id: string, param: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.put(
      `${URL_GROUPS}/${id}/add-users-to-group`,
      param,
      httpOptions
    );
  }

  updateAdmin(id: string, param: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorrization: `Bearer ${token}`,
      }),
    };
    // return this.http.put(`${URL_GROUPS_USER}/${id}`, param, httpOptions);

    return this.http.put<Array<any>>(`${URL_GROUPS_USER}/${id}`, param, {
      ...this.httpOptions(token),
    });
  }

  getMemberList(id: string, query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(
      `${URL_PREFIX}/messages-group-users?include=user&message_group_id=${id}`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  deleteMember(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.delete<Array<any>>(`${URL_GROUPS_USER}/${id}`, {
      ...this.httpOptions(token),
    });
  }

  hiddenGroup(param: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post<Array<any>>(`${URL_HIDDEN_GROUPS}`, param, {
      ...this.httpOptions(token),
    });
  }
}
