import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { UserNotificationService, UserService } from 'src/app/services';
import { Location } from '@angular/common';
import { convertNotificationList } from '../constant';
import * as _ from 'lodash';
import { NotificationDataService } from '../shared/services';
import { query } from '@angular/animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  users: any = [];
  listNotification: any = [];

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = false;
  isAvatar: boolean = false;
  isHasNotification: boolean = true;
  isMoreNotification: boolean = true;

  constructor(
    private notificationDataService: NotificationDataService,
    private location: Location,
    private userNotificationService: UserNotificationService
  ) {}

  ngOnInit() {
    let query: any = { offset: this.offset, limit: this.limit };
    this.getNotificationData(query);
  }

  getNotificationData(query?: string) {
    this.isLoading = true;
    this.userNotificationService
      .getListUserNotification(query)
      .subscribe((res: any) => {
        if (res.data.length === 0) {
          this.isHasNotification = false;
        }

        if (res && res.data) {
          const data = convertNotificationList(res.data);
          this.listNotification = data;
          this.notificationDataService.setMyNotifications([
            ...this.listNotification,
          ]);
          this.offset = this.listNotification.length;
          this.count = +res.paging.count;
        }
      });
    this.isLoading = false;
  }

  loadNotifications() {
    let query: any = { offset: this.offset, limit: this.limit };
    this.userNotificationService
      .getListUserNotification(query)
      .subscribe((res: any) => {
        if (res && res.data) {
          if (res.data.length < 10) {
            this.isMoreNotification = false;
          }
          const data = convertNotificationList(res.data);
          this.listNotification = this.listNotification.concat(data);
          this.offset = this.listNotification.length;
          this.count = +res.paging.count;
        }
      });
  }

  onIonInfinite(ev: any) {
    this.loadNotifications();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  goBack() {
    this.location.back();
  }

  imagesString: string = '';
  getImageSrc(thumbnail: string) {
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.imagesString = '';
  }

  onActionSheet(value: { event: string; data: any; action: string }) {
    if (value.event === 'remove') {
      this.userNotificationService
        .removeUserNotification(value.data.user_notification_id)
        .subscribe();
      this.listNotification = _.filter(this.listNotification, (e) => {
        return e.id != value.data.id;
      });
      if (this.listNotification.length === 0) {
        this.isHasNotification = false;
      }
    }

    if (value.event === 'mark_as_read') {
      const query = {
        status: 1,
      };
      this.userNotificationService
        .updateStatusUserNotification(query, value.data.user_notification_id)
        .subscribe((res: any) => {
          this.listNotification = _.map(this.listNotification, (e: any) => {
            if (e.id === value.data.id) {
              e.status = 1;
              return e;
            }
            return e;
          });
        });
    }

    if (value.event === 'mark_as_unread') {
      const query = {
        status: 0,
      };
      this.userNotificationService
        .updateStatusUserNotification(query, value.data.user_notification_id)
        .subscribe((res: any) => {
          this.listNotification = _.map(this.listNotification, (e: any) => {
            if (e.id === value.data.id) {
              e.status = 0;
              return e;
            }
            return e;
          });
        });
    }
  }

  setAllStatusNotification() {
    this.userNotificationService.markAllAsRead().subscribe(() => {
      this.listNotification = _.map(this.listNotification, (e: any) => {
        e.status = 1;
        return e;
      });
    });
    this.notificationDataService.setCountBadgeNotification(0);
  }
}
