import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IOrganizationInviteUserBody,
  IOrganizationResponseInvitedBody,
} from '../interface';

const URL_PREFIX = 'https://gce.onedev.top/api/v1';

@Injectable({
  providedIn: 'root',
})
export class OrganizationUserService {
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

  inviteUsers(id: string, body: IOrganizationInviteUserBody) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_PREFIX}/organizations/efe87002-8bc2-4306-9db6-205b487abba6/invite-users`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while invite users ' + error.message);
        })
      );
  }

  responseInvited(
    organization_id: string,
    body: IOrganizationResponseInvitedBody
  ) {
    const token = localStorage.getItem('access_token') || '';
    return this.http
      .post(
        `${URL_PREFIX}/organizations/efe87002-8bc2-4306-9db6-205b487abba6/response-invited`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.message);
          return throwError('Error while invite users ' + error.message);
        })
      );
  }

  updateOrganizationUsers(
    organizationId: string,
    userId: string,
    positionId: string,
    iamGroupId: string
  ): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const body = {
      user_id: userId,
      position_id: positionId,
      iam_group_id: iamGroupId,
    };
    return this.http
      .put<any>(
        `${URL_PREFIX}/organization-users/efe87002-8bc2-4306-9db6-205b487abba6`,
        body,
        this.httpOptions(token)
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            'Error while updating a organization user ' + error.message
          );
        })
      );
  }
}
