import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICreateIndustryRequestBody } from '../interface/industry.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class IndustriesService {
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

  getIndustries(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(
      `${URL_PREFIX}/industries?limit=0`,
      this.httpOptions(token)
    );
  }

  getIndustry(id: string): Observable<any> {
    return this.http.get<any>(`${URL_PREFIX}/industries/${id}`);
  }

  addIndustry(industry: ICreateIndustryRequestBody) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/industries`, industry, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a industry' + error.message);
        })
      );
  }

  updateIndustry(industry: any, id: string): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}/industries/${id}`, industry).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.errorHandler.log("Error while updating a industry", error);
        console.log(error.message);
        return throwError('Error while updating a industry ' + error.message);
      })
    );
  }

  deleteIndustry(id: string) {
    return this.http.delete(`${URL_PREFIX}/industries/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a industry ' + error.message);
      })
    );
  }
}
