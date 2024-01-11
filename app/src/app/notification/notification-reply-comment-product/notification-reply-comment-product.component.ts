import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommerceService, UserNotificationService } from '../../services';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { convertProductDetail } from '../../constant';
import { CommerceDataService } from '../../shared/services/commerce-data.service';

@Component({
    selector: 'app-notification-reply-comment-product',
    templateUrl: './notification-reply-comment-product.component.html',
    styleUrls: ['./notification-reply-comment-product.component.scss'],
})
export class NotificationReplyCommentProductComponent implements OnInit {
    @Input() data: any = {};
    @Input() indexNotification: any = 0;
    @Input() isLoading: boolean = true;
    isAvatar: boolean = true;
    imagesString: string = '';

    @Output() actionSheet = new EventEmitter();

    constructor(
        private translate: TranslateService,
        private userNotificationService: UserNotificationService,
        private router: Router,
        private alertController: AlertController,
        private commerceDataService: CommerceDataService,
        private commerceService: CommerceService,
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
            console.log(this.data.product)
            this.isLoading = false;
        }
    }

    setResult(ev: any, data: any) {
        const event = ev?.detail?.data?.action;
        this.actionSheet.emit({ event, data, action: 'reply_comment_product' });
    }

    setStatusNotification(id: string) {
        const query = {
            status: 1,
        }
        this.userNotificationService.updateStatusUserNotification(query, id).subscribe(() => {
            this.data.status = 1;
        });
    }

    checkRouter(id: string) {
        this.commerceService.getProductDetail(id).subscribe(
            (res: any) => {
                if (res) {
                    this.setStatusNotification(this.data.user_notification_id);
                    const data = convertProductDetail(res);
                    this.commerceDataService.setProductDetail(data);
                    this.router.navigate([`/tabs/commerces/${id}`]);
                }
            },
            (error: any) => {
                this.presentAlert();
                this.userNotificationService.removeUserNotification(this.data.user_notification_id).subscribe();
            }
        )
    }

    async presentAlert() {
        const alert = await this.alertController.create({
            header: this.translate.instant('NOTIFICATION.HEADER'),
            message: this.translate.instant('NOTIFICATION.MESSAGE'),
            buttons: [this.translate.instant('BUTTON.CLOSE')],
        });

        await alert.present();
    }

}
