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
export class UserChapterService {
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

  updateUserChapter(
    chapterId: string,
    userId: string,
    iamGroupId: string
  ): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const body = {
      user_id: userId,
      iam_group_id: iamGroupId,
    };
    return this.http
      .put<any>(
        `${URL_PREFIX}/user-chapters/${chapterId}`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            'Error while updating a user chapters ' + error.message
          );
        })
      );
  }
}
