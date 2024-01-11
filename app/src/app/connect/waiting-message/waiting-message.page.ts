import { AlertDialog } from 'src/app/interface';
import { ConversationService } from 'src/app/services/conversation.service';
import { MasterDataService } from 'src/app/shared/services';
import { UnreadMessageService } from './../../shared/services/unread-message.service';
import { GroupService } from 'src/app/services/group.service';
import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  InfiniteScrollCustomEvent,
  IonItemSliding,
  ModalController,
} from '@ionic/angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { query } from '@angular/animations';
import { FriendService } from 'src/app/services';

interface MessageItem {
  number_unread: number;
  id: string;
  name: string;
  description: string;
  thumbnail: string | null;
  is_private: number;
  message: {
    id: string;
    description: string;
    updated_date: string;
    user: {
      id: string;
      name: string;
      thumbnail: string | null;
    };
  };
  read: boolean;
}

@Component({
  selector: 'app-waiting-message',
  templateUrl: './waiting-message.page.html',
  styleUrls: ['./waiting-message.page.scss'],
})
export class WaitingMessagePage implements OnInit {
  currentSegment: string = 'connecting';
  isLoading = false;
  userThumbnail: string = '../../assets/avatar/thumbnail.svg';
  isActionSheetOpen = false;
  limit = 10;
  offset = 0;
  count = 0;
  status = 0;
  param: any;
  user!: { id: string };

  @ViewChild('slidingItem', { static: true }) slidingItem!: IonItemSliding;

  constructor(
    private actionSheetController: ActionSheetController,
    private friendService: FriendService,
    private groupService: GroupService,
    private messageUnreadService: UnreadMessageService,
    private masterDataService: MasterDataService,
    private router: Router,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/tabs/connect') {
        }
      }
    });
  }

  onIonInfinite(ev: any) {
    let query: any = {
      offset: this.offset,
      limit: this.limit,
      status: 0,
    };
    this.getWaitingMess(query);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  truncateMessage(description: string | null): string {
    const maxDescriptionLength = 20;
    if (!description || description.length <= maxDescriptionLength) {
      return description || '';
    }
    return description.substring(0, maxDescriptionLength) + '...';
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  getFirstName(fullName: string): string {
    const names = fullName.split(' ');
    return names.length > 1 ? names[names.length - 1] : names[0];
  }

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = !isOpen;
  }

  closeSlide(slidingItem: { close: () => void }) {
    slidingItem.close();
  }

  async openActionSheet(item: any) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: this.translate.instant('TAB.MESSAGE.MARK_AS_READ'),
          // cssClass: 'left-align-buttons',
          handler: () => {
            this.markAsRead(item);
          },
        },
        {
          text: this.translate.instant('TAB.MESSAGE.RESTRICT'),
          // cssClass: 'left-align-buttons',
          handler: () => {
            this.restrictItem(item);
          },
        },
        {
          text: this.translate.instant('TAB.MESSAGE.BLOCK_MESSAGE'),
          // cssClass: 'left-align-buttons',
          role: 'destructive',
          handler: () => {
            this.blockItem(item);
          },
        },
        {
          text: this.translate.instant('TAB.MESSAGE.DELETE_MESSAGE'),
          // cssClass: 'left-align-buttons',
          role: 'destructive',
          handler: () => {
            this.deleteItem(item);
          },
        },
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          // cssClass: 'left-align-buttons',
          role: 'cancel',
          handler: () => {
            this.dismissActionSheet();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async dismissActionSheet() {
    const actionSheet = await this.actionSheetController.getTop();
    if (actionSheet) {
      await actionSheet.dismiss();
    }
  }

  async markAsRead(item: any) {
    let read: any = {
      status: 1,
      message_group_id: item.id,
    };

    this.groupService.readMessage(read).subscribe();

    const index = this.waitings.findIndex((waiting) => waiting.id === item.id);
    if (index !== -1) {
      this.waitings[index].number_unread = 0;

      const numberUnread =
        this.waitings.reduce((count: number, connect: any) => {
          return count + connect.number_unread;
        }, 0) - item.number_unread;

      this.messageUnreadService.updateNumberUnread(numberUnread);
    }

    await this.dismissActionSheet();
  }

  async restrictItem(item: any) {
    await this.dismissActionSheet();
  }

  async blockItem(item: any) {
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant(
        'NOTIFICATION.QUESTION.BLOCK_GROUP_FRIEND'
      ),
      buttons: [
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            if (item.is_private === 1) {
              const data = {
                resource_id: item.id,
                resource_type: 'User_MessageGroup',
              };
              this.friendService.blockConversation(data).subscribe();
            } else if (item.is_private === 0) {
              const data = {
                resource_id: item.id,
                resource_type: 'User_User',
              };
              this.friendService.blockConversation(data).subscribe();
            }
          },
        },
      ],
    };
    this.presentAlert(alertDialog);
    await this.dismissActionSheet();
  }

  async deleteItem(item: any) {
    await this.dismissActionSheet();
  }

  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }

  formatUpdateTime(updatedDate: string): string {
    const now = moment();
    const date = moment(updatedDate);

    if (now.isSame(date, 'day')) {
      return date.format('hh:mm a');
    } else if (now.isSame(date, 'week')) {
      return date.format('ddd');
    } else if (now.isSame(date, 'year')) {
      return date.format('MMM D');
    } else {
      return date.format('MMM D, YYYY');
    }
  }

  waitings: any[] = [];

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    let query: any = {
      offset: this.offset,
      limit: this.limit,
      status: 0,
    };
    this.getWaitingMess(query);
  }

  getWaitingMess(query?: any) {
    this.groupService
      .getLatestMessage(this.user.id, query)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.waitings = res.data;
          this.waitings.sort((a: MessageItem, b: MessageItem) => {
            const dateA = new Date(a.message.updated_date);
            const dateB = new Date(b.message.updated_date);

            return dateB.getTime() - dateA.getTime();
          });
          const numberUnread = this.waitings.reduce(
            (countUnread: number, connect: any) => {
              return countUnread + connect.number_unread;
            },
            0
          );
          this.messageUnreadService.updateNumberUnread(numberUnread);
        }
        this.offset += this.limit;
        this.count = +res.paging.count;
        this.isLoading = false;
      });
  }

  hiddenGroup(ev: any) {
    const hiddenData = {
      message_group_id: ev.id,
    };

    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('TAB.MESSAGE.HIDE_MESSAGE_GROUP'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.groupService.hiddenGroup(hiddenData).subscribe(() => {
              this.waitings = this.waitings.filter(
                (waiting) => waiting.id !== ev.id
              );
            });
          },
        },
      ],
    };
    this.presentAlert(alertDialog);
  }
}
