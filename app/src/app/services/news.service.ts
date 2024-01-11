import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CreateNewsParams,
  NewsListResponse,
  NewsResponse,
} from '../interface/news.interface';
import { Router } from '@angular/router';

const URL_PREFIX = 'https://gce.onedev.top/api/v1/news';
const URL_MEDIA = 'https://gce.onedev.top/api/media';
const URL_REACTIONS = 'https://gce.onedev.top/api/v1/reactions';
const URL_COMMENTS = 'https://gce.onedev.top/api/v1/comments';
const URL_V1 = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class NewsService {
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

  getNews(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<NewsListResponse>(`${URL_PREFIX}`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getNewsFollowing(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<NewsListResponse>(`${URL_PREFIX}/following`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getNew(id: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<NewsResponse>(
      `${URL_PREFIX}/${id}?include=user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children`,
      {
        ...this.httpOptions(token),
      }
    );
  }

  createNews(params: CreateNewsParams): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}`, params, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  updateNews(body: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(`${URL_PREFIX}/${body.id}`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) this.router.navigate(['login']);

          return throwError('Error while updating a user ' + error.message);
        })
      );
  }

  deleteNews(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_PREFIX}/${id}`, this.httpOptions(token))
      .pipe(
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

  getReactions(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_REACTIONS}`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  postReaction(body: {
    resource_id: string;
    resource_type: string;
    react_emoji: string;
  }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_REACTIONS}`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  getComments(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<NewsListResponse>(`${URL_COMMENTS}`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  postComment(body: {
    name: string;
    resource_id: string;
    description?: string;
    type?: string;
    parent_id?: string;
    images?: any;
    display_order?: number;
  }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/comments`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  putComment(body: {
    name: string;
    resource_id: string;
    description?: string;
    type?: string;
    parent_id?: string;
    id?: string;
    images?: any;
    display_order?: number;
  }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(`${URL_COMMENTS}/${body.id}`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  deleteComment(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_COMMENTS}/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  getParticipates(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<NewsListResponse>(`${URL_V1}/participates`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  postParticipates(body: { news_id: string }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/participates`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  deleteParticipates(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/participates/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  getBids(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/bids`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getBid(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/bids/${id}`, {
      ...this.httpOptions(token),
    });
  }

  postBids(body: {
    price: number;
    news_id: string;
    total_time?: number;
    description: string;
  }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(`${URL_V1}/bids`, body, this.httpOptions(token)).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError(
          'Error while creating a organization' + error.message
        );
      })
    );
  }

  putBids(body: { description: number; id: string }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(`${URL_V1}/bids/${body.id}`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  deleteBids(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/bids/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  postImages(body: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/images`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  deleteImages(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/images/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  postHidden(body: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/hidden-source`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  deleteHidden(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/hidden-source/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  postFollowing(body: { resource_id: string; resource_type: string }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/follows`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  postReport(body: { parent_id: string; description: string }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/reports`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  getIndustries(query?: { q: string; include?: string }): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/industries`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  addIndustry(body: { name: string; description?: string }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/industries`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Industry' + error.message);
        })
      );
  }
}
