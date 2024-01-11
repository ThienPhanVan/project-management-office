import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICategory } from '../interface/category.interface';

const URL_PREFIX = 'https://gce.onedev.top/api';
@Injectable({
  providedIn: 'root',
})
export class ProductCategoriesService {
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

  getCategories(params?: any): Observable<Array<ICategory>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<Array<ICategory>>(`${URL_PREFIX}/product-categories`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  getCategory(id: string, params?: any): Observable<ICategory> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<ICategory>(`${URL_PREFIX}/product-categories/${id}`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  addCategory(Category: ICategory) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_PREFIX}/product-categories`,
        Category,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Category' + error.message);
        })
      );
  }

  updateCategory(category: ICategory, id: string): Observable<any> {
    return this.http
      .put<any>(`${URL_PREFIX}/product-categories/${id}`, category)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // this.errorHandler.log("Error while updating a Category", error);
          console.log(error.message);
          return throwError('Error while updating a Category ' + error.message);
        })
      );
  }

  deleteCategory(id: string) {
    return this.http.delete(`${URL_PREFIX}/product-categories/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return throwError('Error while deleting a Category ' + error.message);
      })
    );
  }

  searchCategory(query: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_PREFIX}/product-categories/search?q=${query}`,
      this.httpOptions(token)
    );
  }
}
