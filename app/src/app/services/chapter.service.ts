import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateFollowParams } from '../interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1/chapters';
const URL_V1 = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class ChapterService {
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

  getChapters(query?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}?include=users,organizations,user_chapters`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  getChapter(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/${id}?include=users,organizations,user_chapters`,
      this.httpOptions(token)
    );
  }

  deleteUserChapter(id: string, body: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post<any>(
      `${URL_PREFIX}/${id}/remove-users`,
      body,
      this.httpOptions(token)
    );
  }

  deleteOrganizationChapter(id: string, body: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post<any>(
      `${URL_PREFIX}/${id}/remove-organizations`,
      body,
      this.httpOptions(token)
    );
  }

  inviteUserChapter(id: string, params: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post<any>(
      `${URL_PREFIX}/${id}/invite-users`,
      params,
      this.httpOptions(token)
    );
  }

  inviteOrganizationChapter(id: string, params: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post<any>(
      `${URL_PREFIX}/${id}/invite-organizations`,
      params,
      this.httpOptions(token)
    );
  }

  updateUserChapter(
    chapterId: string,
    userId: string,
    iamGroupId: string
  ): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const body = {
      user_id: userId,
      chapter_id: chapterId,
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

  searchChapters(query: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/search?q=${query}`,
      this.httpOptions(token)
    );
  }

  getUsersRequested() {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_V1}/chapter-join-requests?include=users,chapter`,
      this.httpOptions(token)
    );
  }

  joinChapter(body: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/chapter-join-requests`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while join a chapter' + error.message);
        })
      );
  }

  cancelJoinChapter(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/chapter-join-requests/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while cancel join a chapter' + error.message
          );
        })
      );
  }
}
