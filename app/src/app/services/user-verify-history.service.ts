import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ListUsers } from '../interface/user.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1/member-verify-histories';
@Injectable({
  providedIn: 'root',
})
export class UserVerifyHistoryService {
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

  getMemberVerifyHistories(query?: any): Observable<ListUsers> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ListUsers>(`${URL_PREFIX}`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }
}
