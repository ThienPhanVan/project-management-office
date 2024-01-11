import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirebaseToken } from '../interface';
import { getMessaging, getToken } from 'firebase/messaging';

const URL_FIREBASE_TOKENS = `${environment.api}/firebase-tokens`;
const URL_INACTIVE_TOKENS = `${environment.api}/firebase-tokens/inactive`;

@Injectable({
  providedIn: 'root',
})
export class FirebaseNotificationService {
  constructor(private http: HttpClient) {}

  httpOptions = (token: string) => {
    return token
      ? {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        }
      : {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };
  };

  getToken = async () => {
    try {
      const messaging = getMessaging();
      return await getToken(messaging, {
        vapidKey: environment.firebase.vapidKey,
      });
    } catch (err) {
      throw new Error(err as string);
    }
  };

  registerToken = async (userId: string) => {
    const accessToken = localStorage.getItem('access_token') || '';
    const deviceType = window.navigator.userAgent;
    const notificationToken = await this.getToken();

    const firebaseToken: FirebaseToken = {
      device_type: deviceType,
      notification_token: notificationToken,
      user_id: userId,
    };

    return this.http
      .post(URL_FIREBASE_TOKENS, firebaseToken, this.httpOptions(accessToken))
      .subscribe({
        next: (res) => {
          console.log(res);
          return res;
        },
        error: (error: HttpErrorResponse) => {
          return throwError(
            () => new Error('Error while push notification: ' + error.message)
          );
        },
      });
  };

  inactiveToken = async () => {
    const accessToken = localStorage.getItem('access_token') || '';
    const token = await this.getToken();

    return this.http
      .post(
        `${URL_INACTIVE_TOKENS}/${token}`,
        null,
        this.httpOptions(accessToken)
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          return res;
        },
        error: (error: HttpErrorResponse) => {
          return throwError(
            () => new Error('Error while inactive token: ' + error.message)
          );
        },
      });
  };
}
