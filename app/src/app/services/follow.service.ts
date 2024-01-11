import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateFollowParams } from '../interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
const URL_FOLLOWS = 'https://gce.onedev.top/api/v1/follows';
@Injectable({
  providedIn: 'root',
})
export class FollowService {
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

  getListUserFollowers(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_FOLLOWS}/user-followers`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getListUserFollowings(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_FOLLOWS}/user-followings`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getListUserFollowersOrganization(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_FOLLOWS}/organization-followers`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  addFollow(params: CreateFollowParams) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_FOLLOWS}`, params, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Follow' + error.message);
        })
      );
  }

  unFollow(resource_id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_FOLLOWS}/${resource_id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a daily ' + error.message);
        })
      );
  }
}
