import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICountry } from '../interface/country.interface';
import { ICategory } from '../interface';
import { getToken } from 'firebase/messaging';
import { query } from '@angular/animations';

const URL_PREFIX = 'https://gce.onedev.top/api';
const URL_REACTIONS = 'https://gce.onedev.top/api/v1/reactions';
const URL_COMMENTS = 'https://gce.onedev.top/api/v1/comments';
const URL_MEDIA = 'https://gce.onedev.top/api/media';
const URL_V1 = 'https://gce.onedev.top/api/v1';

@Injectable({
  providedIn: 'root',
})
export class CommerceService {
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

  getProducts(params?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/e-commerce/products`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  getProductsFollowing(params?: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/e-commerce/products/following`, {
      ...this.httpOptions(token),
      params: params,
    });
  }

  getProductDetail(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_V1}/e-commerce/products/${id}?include=author,summary,user,product_category,images,organization`,
      {
        ...this.httpOptions(token),
      }
    );
  }

  postProduct(body: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/e-commerce/products`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while creating a organization' + error.message
          );
        })
      );
  }

  putProduct(body: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(
        `${URL_V1}/e-commerce/products/${body.id}`,
        body,
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

  deleteProducts(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/e-commerce/products/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while deleting a user ' + error.message);
        })
      );
  }

  productReport(body: { parent_id: string; description: string }) {
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

  getProductCategories(query?: {
    q: string;
    include?: string;
  }): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_V1}/e-commerce/product-categories/get-category-user-favorite`,
      {
        ...this.httpOptions(token),
        params: query || {},
      }
    );
  }

  createCheckedCategory(body: any) {
    const token = localStorage.getItem('access_token') || '';

    return this.http
      .post(
        `${URL_V1}/e-commerce/user-favorite-product-categories/bulk`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while update a category' + error.message);
        })
      );
  }
  updateCheckedCategory(body: any) {
    const token = localStorage.getItem('access_token') || '';

    return this.http
      .post(
        `${URL_V1}/e-commerce/user-favorite-product-categories/bulk-upsert`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while update a category' + error.message);
        })
      );
  }

  addCategory(body: { name: string; description?: string }) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_V1}/e-commerce/product-categories`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while creating a Category' + error.message);
        })
      );
  }

  getComments(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_COMMENTS}`, {
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

  // addCountry(country: ICountry) {
  //   const token = localStorage.getItem('access_token') || '';
  //   return this.http
  //     .post(`${URL_V1}/countries`, country, this.httpOptions(token))
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         console.log(error.message);
  //         return throwError('Error while creating a Country' + error.message);
  //       })
  //     );
  // }

  // updateCountry(country: ICountry, id: string): Observable<any> {
  //   return this.http.put<any>(`${URL_V1}/countries/${id}`, country).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       // this.errorHandler.log("Error while updating a country", error);
  //       console.log(error.message);
  //       return throwError('Error while updating a country ' + error.message);
  //     })
  //   );
  // }

  // deleteCountry(id: string) {
  //   return this.http.delete(`${URL_V1}/countries/${id}`).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.log(error.message);
  //       return throwError('Error while deleting a country ' + error.message);
  //     })
  //   );
  // }

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

  getCartItems(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/e-commerce/cart-items`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  insertCartItem(body: any) {
    const token = localStorage.getItem('access_token') || '';

    return this.http
      .post(`${URL_V1}/e-commerce/cart-items`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while inserting a product to cart' + error.message
          );
        })
      );
  }

  updateCartItem(body: any, id: string) {
    const token = localStorage.getItem('access_token') || '';

    return this.http
      .put(
        `${URL_V1}/e-commerce/cart-items/${id}`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while update a cart' + error.message);
        })
      );
  }

  deleteCartItem(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(`${URL_V1}/e-commerce/cart-items/${id}`, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while deleting a cart item ' + error.message
          );
        })
      );
  }

  getOrders(query: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(`${URL_V1}/e-commerce/orders`, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  getOrderDetail(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_V1}/e-commerce/orders/${id}?include=items,buyer,status_history,items.products,items.product_category,items.images,items.organization,items.user,items.product_variants`,
      {
        ...this.httpOptions(token),
      }
    );
  }

  postOrder(body: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_V1}/e-commerce/orders`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while create a order' + error.message);
        })
      );
  }
  updateStatusOrder(body: any, id: string) {
    const token = localStorage.getItem('access_token') || '';

    return this.http
      .put(`${URL_V1}/e-commerce/orders/${id}`, body, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while update a cart' + error.message);
        })
      );
  }
  getAddressShipping() {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get<any>(
      `${URL_V1}/e-commerce/user-addresses?include=items,buyer,status_history,user_address,items.products,items.product_category,items.images,items.organization,items.user,items.product_variants`,
      {
        ...this.httpOptions(token),
      }
    );
  }

  createAddressShipping(body: any) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_V1}/e-commerce/user-addresses`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while create a address shipping' + error.message
          );
        })
      );
  }
  updateAddressShipping(body: any, id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .put(
        `${URL_V1}/e-commerce/user-addresses/${id}`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while update a address shipping' + error.message
          );
        })
      );
  }

  deleteAddressShipping(id: string) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .delete(
        `${URL_V1}/e-commerce/user-addresses/${id}`,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError(
            'Error while delete a address shipping' + error.message
          );
        })
      );
  }
}
