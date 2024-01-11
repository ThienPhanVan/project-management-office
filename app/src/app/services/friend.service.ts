import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
const URL_FRIENDS = 'https://gce.onedev.top/api/v1/friends';
@Injectable({
  providedIn: 'root',
})
export class FriendService {
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

  request(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_FRIENDS}/${id}/request`, {}, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while request a friend ' + error.message);
        })
      );
  }

  unRequest(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_FRIENDS}/${id}/remove-request`, {}, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while request a friend ' + error.message);
        })
      );
  }

  accept(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(
      `${URL_FRIENDS}/${id}/accept`,
      {},
      this.httpOptions(token)
    );
  }
  reject(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(
      `${URL_FRIENDS}/${id}/reject`,
      {},
      this.httpOptions(token)
    );
  }

  getListFriends(id: string, notInGroupId: string): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    let url = `${URL_FRIENDS}/${id}/friends`;
    if (notInGroupId !== undefined) {
      url += `?not_in_group_id=${notInGroupId}`;
    }

    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Array<any>>(url, { headers });
  }

  getWaitList(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_FRIENDS}/waitlist`, {
      ...this.httpOptions(token),
    });
  }

  getRequested(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_FRIENDS}/requested`, {
      ...this.httpOptions(token),
    });
  }

  getSuggestion(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(`${URL_FRIENDS}/suggestion`, {
      ...this.httpOptions(token),
    });
  }

  deleteFriend(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.delete(`${URL_FRIENDS}/${id}`, {
      ...this.httpOptions(token),
    });
  }

  blockConversation(params: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(`${URL_PREFIX}/blocks`, params, {
      ...this.httpOptions(token),
    });
  }
}
