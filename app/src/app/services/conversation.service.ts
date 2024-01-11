import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';
const URL_MESSAGE = 'https://gce.onedev.top/api/v1/messages';
const URL_GROUPS = 'https://gce.onedev.top/api/v1/message-groups';
const URL_MEDIA = 'https://gce.onedev.top/api/media';
const URL_REACTION = 'https://gce.onedev.top/api/v1/messages-reactions';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
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

  getMessage(id: string, query?: any): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    const url = `${URL_MESSAGE}?include=user,message_images,message_pin,message_reactions,message_summary,message_group`;
    const fullUrl = id ? `${url}&message_group_id=${id}` : url;

    return this.http.get<Array<any>>(fullUrl, {
      ...this.httpOptions(token),
      params: query || {},
    });
  }

  sendMessage(messageData: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(`${URL_MESSAGE}`, messageData, this.httpOptions(token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError('Error while sending message: ' + error.message);
        })
      );
  }

  editMessage(id: string, messageData: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.put(
      `${URL_MESSAGE}/${id}`,
      messageData,
      this.httpOptions(token)
    );
  }

  reactionMessage(data: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(`${URL_PREFIX}/messages-reactions`, data, {
      ...this.httpOptions(token),
    });
  }

  getUserReaction(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get(`${URL_REACTION}?include=user&message_id=${id}`, {
      ...this.httpOptions(token),
    });
  }

  pinMessage(param: any): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.post(`${URL_PREFIX}/messages-pins`, param, {
      ...this.httpOptions(token),
    });
  }

  getMessagePin(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get(
      `https://gce.onedev.top/api/v1/messages-pins?include=message_group_id%2Cmessage&message_group_id=${id}`,
      {
        ...this.httpOptions(token),
      }
    );
  }

  deletePinMessage(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.delete(`${URL_PREFIX}/messages-pins/${id}`, {
      ...this.httpOptions(token),
    });
  }

  getPinMessage(id: string): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.get(`${URL_PREFIX}/${id}/pin`, {
      ...this.httpOptions(token),
    });
  }

  deleteMessage(id: string): Observable<Array<any>> {
    const token = localStorage.getItem('access_token') || '';
    return this.http.delete<Array<any>>(`${URL_MESSAGE}/${id}`, {
      ...this.httpOptions(token),
    });
  }
}
