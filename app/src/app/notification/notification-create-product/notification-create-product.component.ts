import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommerceService, UserNotificationService } from '../../services';
import { NewsService } from '../../services/news.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NewsDataService } from '../../shared/services';
import { convertDataNewsDetail, convertProductDetail } from '../../constant';
import { CommerceDataService } from '../../shared/services/commerce-data.service';

@Component({
  selector: 'app-notification-create-product',
  templateUrl: './notification-create-product.component.html',
  styleUrls: ['./notification-create-product.component.scss'],
})
export class NotificationCreateProductComponent implements OnInit {
  @Input() data: any = {};
  @Input() indexNotification: any = 0;
  @Input() isLoading: boolean = true;
  isAvatar: boolean = true;
  imagesString: string = '';

  @Output() actionSheet = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private userNotificationService: UserNotificationService,
    private newsService: NewsService,
    private commerceService: CommerceService,
    private router: Router,
    private alertController: AlertController,
    private newsDataService: NewsDataService,
    private commerceDataService: CommerceDataService
  ) {}

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
    this.actionSheet.emit({ event, data, action: 'create_event' });
  }

  setStatusNotification(id: string) {
    const query = {
      status: 1,
    };
    this.userNotificationService
      .updateStatusUserNotification(query, id)
      .subscribe(() => {
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
        this.userNotificationService
          .removeUserNotification(this.data.user_notification_id)
          .subscribe();
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.MESSAGE_PRODUCT'),
      buttons: [this.translate.instant('BUTTON.CLOSE')],
    });

    await alert.present();
  }
}
