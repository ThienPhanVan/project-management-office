import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserNotificationService } from '../../services';

@Component({
  selector: 'app-notification-accept-friend',
  templateUrl: './notification-accept-friend.component.html',
  styleUrls: ['./notification-accept-friend.component.scss'],
})
export class NotificationAcceptFriendComponent implements OnInit {
  @Input() data: any = {};
  @Input() indexNotification: any = 0;
  @Input() isLoading: boolean = true;
  isAvatar: boolean = true;
  imagesString: string = '';

  @Output() actionSheet = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private userNotificationService: UserNotificationService,
  ) { }

  public actionSheetButtonRead = [
    // {
    //   text: this.translate.instant('BUTTON.REPORT'),
    //   role: 'report',
    //   data: {
    //     action: 'report',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.MARK_AS_UNREAD_NOTIFICATION'),
      role: 'mark_as_unread',
      data: {
        action: 'mark_as_unread',
      },
    },
    {
      text: this.translate.instant('BUTTON.DELETE_NOTIFICATION'),
      role: 'remove',
      data: {
        action: 'remove',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetButtonUnread = [
    // {
    //   text: this.translate.instant('BUTTON.REPORT'),
    //   role: 'report',
    //   data: {
    //     action: 'report',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.MARK_AS_READ_NOTIFICATION'),
      role: 'mark_as_read',
      data: {
        action: 'mark_as_read',
      },
    },
    {
      text: this.translate.instant('BUTTON.DELETE_NOTIFICATION'),
      role: 'remove',
      data: {
        action: 'remove',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  ngOnInit(): void {
    if (this.data?.author) {
      this.isLoading = false;
    }
  }

  setResult(ev: any, data: any) {
    const event = ev?.detail?.data?.action;
    this.actionSheet.emit({ event, data, action: 'friend_accept' });
  }

  setStatusNotification(id: string) {
    const query = {
      status: 1,
    }
    this.userNotificationService.updateStatusUserNotification(query, id).subscribe(() => {
      this.data.status = 1;
    });
  }
}
