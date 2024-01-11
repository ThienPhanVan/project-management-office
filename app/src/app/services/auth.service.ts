import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  LoginRequestBody,
  LoginResponse,
} from '../page/login/login.page.interface';
import {
  RegisterRequestBody,
  RegisterResponse,
} from '../page/register/register.page.interface';
import {
  ForgotPasswordResponse,
  ForgotPasswordResquest,
} from '../page/forgot-password/forgot-password.page.interface';
import { UserResponse } from '../profile/edit/edit-profile.page.interface';
import {
  CheckedPasswordResponse,
  OTPResponse,
  PhoneResponse,
} from '../profile/change-phone/change-phone.page.interface';
import { ChangePasswordRequest } from '../interface/index';
import { environment } from 'src/environments/environment';

const URL_PREFIX = `${environment.api}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  login(params: LoginRequestBody): Observable<LoginResponse> {
    return this.http.post<any>(`${URL_PREFIX}/sign-in`, params).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }

  register(params: RegisterRequestBody): Observable<RegisterResponse> {
    return this.http.post<any>(`${URL_PREFIX}/register`, params).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }
  resetPassword(params: any): Observable<RegisterResponse> {
    return this.http.post<any>(`${URL_PREFIX}/reset-password`, params).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }

  forgotPassword(
    body: ForgotPasswordResquest
  ): Observable<ForgotPasswordResponse> {
    return this.http.post<any>(`${URL_PREFIX}/forgot-password`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while send mail page ' + error.message);
      })
    );
  }

  me(): Observable<UserResponse> {
    const token = localStorage.getItem('access_token') || '';

    return this.http.get<any>(`${URL_PREFIX}/me`, this.httpOptions(token)).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while get me ' + error.message);
      })
    );
  }

  resourceAccess(): Observable<any> {
    const token = localStorage.getItem('access_token') || '';

    return this.http
      .post<any>(`${URL_PREFIX}/resource-access`, {}, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while get resource access ' + error.message);
        })
      );
  }

  changePassword(params: ChangePasswordRequest): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post<any>(
        `${URL_PREFIX}/change-password`,
        params,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while change password ' + error.message);
        })
      );
  }

  changePhonePassword(passowrd: string): Observable<CheckedPasswordResponse> {
    return this.http.post<any>(`${URL_PREFIX}/me`, passowrd).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while check password ' + error.message);
      })
    );
  }

  changePhone(phone: string): Observable<PhoneResponse> {
    return this.http.post<any>(`${URL_PREFIX}/me`, phone).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while add phone ' + error.message);
      })
    );
  }

  checkOTPPhone(otp: string): Observable<OTPResponse> {
    return this.http.post<any>(`${URL_PREFIX}/me`, otp).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error while check otp' + error.message);
      })
    );
  }

  getInvitationInfo(id: string): Observable<UserResponse> {
    return this.http
      .get<any>(
        `${environment.api}/invitation-users/${id}?include=organization`
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while get me ' + error.message);
        })
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
}
