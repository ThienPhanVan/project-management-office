import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IOrganizationList } from '../interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
const URL_ORGANIZATION = 'https://gce.onedev.top/v1/organizations';
const URL_MEDIA = 'https://gce.onedev.top/api/media';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
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

  getOrganizations(query?: any): Observable<IOrganizationList> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<IOrganizationList>(`${URL_PREFIX}/organizations`, {
      ...this.httpOptions(token),
      params: query,
    });
  }

  getOrganizationsByMe(): Observable<IOrganizationList> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<IOrganizationList>(`${URL_PREFIX}/organizations/me`, {
      ...this.httpOptions(token),
    });
  }

  getOrganization(id: string, params: any = {}): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/organizations/efe87002-8bc2-4306-9db6-205b487abba6`,
      {
        ...this.httpOptions(token),
        params: params,
      }
    );
  }

  addOrganization(organization: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_PREFIX}/organizations`,
        organization,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  updateOrganization(organization: any, id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put<any>(
        `${URL_PREFIX}/organizations/efe87002-8bc2-4306-9db6-205b487abba6`,
        organization,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            'Error while updating a organization ' + error.message
          );
        })
      );
  }

  deleteOrganization(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(
        `${URL_PREFIX}/organizations/efe87002-8bc2-4306-9db6-205b487abba6`,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while deleting a organization ' + error.message
          );
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

  searchOrganizations(query: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_ORGANIZATION}/search?q=${query}`,
      this.httpOptions(token)
    );
  }
}
