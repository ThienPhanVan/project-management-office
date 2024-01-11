import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICountry } from '../interface/country.interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class CountriesService {
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

  getCountries(params?: any): Observable<Array<ICountry>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<ICountry>>(`${URL_PREFIX}/countries`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  getCountry(id: string, params?: any): Observable<ICountry> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ICountry>(`${URL_PREFIX}/countries/${id}`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  addCountry(country: ICountry) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/countries`, country, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Country' + error.message);
        })
      );
  }

  updateCountry(country: ICountry, id: string): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}/countries/${id}`, country).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.errorHandler.log("Error while updating a country", error);
        console.log(error.message);
        return throwError('Error while updating a country ' + error.message);
      })
    );
  }

  deleteCountry(id: string) {
    return this.http.delete(`${URL_PREFIX}/countries/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a country ' + error.message);
      })
    );
  }
}
