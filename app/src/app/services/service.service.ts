import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICreateServiceRequestBody } from '../interface/service.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class ServicesService {
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

  getServices(): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<any>>(
      `${URL_PREFIX}/services?limit=0`,
      this.httpOptions(token)
    );
  }

  getService(id: string): Observable<any> {
    return this.http.get<any>(`${URL_PREFIX}/services/${id}`);
  }

  addService(Service: ICreateServiceRequestBody) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/services`, Service, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Service' + error.message);
        })
      );
  }

  updateService(Service: any, id: string): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}/services/${id}`, Service).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.errorHandler.log("Error while updating a Service", error);
        console.log(error.message);
        return throwError('Error while updating a Service ' + error.message);
      })
    );
  }

  deleteService(id: string) {
    return this.http.delete(`${URL_PREFIX}/services/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a Service ' + error.message);
      })
    );
  }
}
