import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FriendService, UserNotificationService, UserService } from '../../services';

@Component({
    selector: 'app-notification-request-friend',
    templateUrl: './notification-request-friend.component.html',
    styleUrls: ['./notification-request-friend.component.scss'],
})
export class NotificationRequestFriendComponent implements OnInit {
    @Input() data: any = {};
    @Input() indexNotification: any = 0;
    @Input() isLoading: boolean = true;
    isAvatar: boolean = true;
    isShowButton: boolean = true;
    isAccept: boolean = false;
    isDelete: boolean = false;
    imagesString: string = '';

    @Output() actionSheet = new EventEmitter();

    constructor(
        private translate: TranslateService,
        private userNotificationService: UserNotificationService,
        private friendService: FriendService,
        private userService: UserService,
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
        if (this.data?.user) {
            this.isLoading = false;
        }
        this.userService.getUser(this.data?.user?.id).subscribe(res => {
            if(res.has_friended) {
                this.isShowButton = false;
                this.isAccept = true;
            }
        })
    }

    setResult(ev: any, data: any) {
        const event = ev?.detail?.data?.action;
        this.actionSheet.emit({ event, data, action: 'friend_request' });
    }

    setStatusNotification(id: string) {
        const query = {
            status: 1,
        }
        this.userNotificationService.updateStatusUserNotification(query, id).subscribe(() => {
            this.data.status = 1;
        });
    }

    accept(id: string) {
        this.friendService.accept(id).subscribe((res) => {
            this.setStatusNotification(this.data.user_notification_id);
            this.data.status = 1;
            this.isShowButton = false;
            this.isAccept = true;
            this.deleteUserNotification(this.data.user_notification_id);
        })
    }

    delete(id: string) {
        this.friendService.reject(id).subscribe((res) => {
            this.setStatusNotification(this.data.user_notification_id);
            this.data.status = 1;
            this.isShowButton = false;
            this.isDelete = true;
            this.deleteUserNotification(this.data.user_notification_id);
        })
    }

    deleteUserNotification(id: string) {
        this.userNotificationService.removeUserNotification(id).subscribe();
    }
}
