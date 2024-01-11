import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class NotificationDataService {
  private myNotificationsBus$ = new BehaviorSubject<any[]>([{} as any]);
  myNotifications$ = this.myNotificationsBus$.asObservable();

  private myNotificationsFilterBus$ = new BehaviorSubject<any>({});
  myNotificationsFilter$ = this.myNotificationsFilterBus$.asObservable();
  private countNotificationBadegesBus$ = new BehaviorSubject<any>([]);
  countBadges$ = this.countNotificationBadegesBus$.asObservable();

  constructor() { }

  setMyNotifications(notifications: any[]) {
    this.myNotificationsBus$.next(notifications);
  }

  setMyNotificationsFilter(options: any) {
    this.myNotificationsFilterBus$.next(options);
  }

  setCountBadgeNotification(data: any) {
    this.countNotificationBadegesBus$.next(data);
  }
}
