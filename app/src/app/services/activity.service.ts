import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
const URL_PREFIX = 'https://gce.onedev.top/api/v1/activities';
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
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

  getActivities(query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_PREFIX}?include=user_activity`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getProjectActivities(query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `https://gce.onedev.top/api/v1/projects/${query.project_id}/activities`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }
  searchActivitys(query: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/search?q=${query}`,
      this.httpOptions(token)
    );
  }
}
