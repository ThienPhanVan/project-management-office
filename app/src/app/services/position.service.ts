import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IPosition } from '../interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
@Injectable({
  providedIn: 'root',
})
export class PositionsService {
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

  getPositions(params?: any): Observable<Array<IPosition>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<IPosition>>(`${URL_PREFIX}/positions`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  getPosition(id: string, params?: any): Observable<IPosition> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<IPosition>(`${URL_PREFIX}/positions/${id}`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  addPosition(position: IPosition) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_PREFIX}/positions`, position, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Position' + error.message);
        })
      );
  }

  updatePosition(position: IPosition, id: string): Observable<any> {
    return this.http.put<any>(`${URL_PREFIX}/positions/${id}`, position).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.errorHandler.log("Error while updating a position", error);
        console.log(error.message);
        return throwError('Error while updating a position ' + error.message);
      })
    );
  }

  deletePosition(id: string) {
    return this.http.delete(`${URL_PREFIX}/positions/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a position ' + error.message);
      })
    );
  }
}
