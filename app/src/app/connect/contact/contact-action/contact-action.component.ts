import { GroupService } from 'src/app/services/group.service';
import { SharedModule } from './../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ModalController,
  NavParams,
  NavController,
  AlertController,
} from '@ionic/angular';
import * as _ from 'lodash';
import { UserDetail } from 'src/app/interface/user.interface';
import { FollowService, FriendService, UserService } from 'src/app/services';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, SharedModule],
  selector: 'app-contact-action',
  templateUrl: './contact-action.component.html',
  styleUrls: ['./contact-action.component.scss'],
})
export class ContactActionComponent implements OnInit {
  @Input() users!: UserDetail;
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();

  userThumbnail: string = '../../assets/avatar/thumbnail.svg';

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private friendService: FriendService,
    private groupService: GroupService,
    private translate: TranslateService,
    private alertController: AlertController,
    private followService: FollowService
  ) {}

  ngOnInit() {
  }

  messAction() {
    this.modalCtrl.dismiss();
    const groupData = {
      name: '',
      is_private: 0,
      member_ids: [this.users.id],
    };
    this.groupService.createGroup(groupData).subscribe((res) => {
      const navigationExtras: NavigationExtras = {
        state: { item: res }
      };
      this.router.navigate(['/group', res.id], navigationExtras);
    });
  }

  blockAction() {
    this.modalCtrl.dismiss();
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.BLOCK_FRIEND'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            const data = {
              resource_id: this.users.id,
              resource_type: 'User_User',
            };
            this.friendService.blockConversation(data).subscribe();
          },
        },
      ],
    };
    this.presentAlert(alertDialog);
  }
  

  unfollowAction() {
    this.modalCtrl.dismiss();

    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.UNFOLLOW_FRIEND'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.followService.unFollow(this.users.id).subscribe(
              () => {},
              (error) => {
                console.error('Error during delete:', error);
              }
            );
          },
        },
      ],
    };
    this.presentAlert(alertDialog);
  }

  unfriendAction() {
    this.modalCtrl.dismiss(this.users.id);
    this.onDelete.emit(this.users.id);
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE_FRIEND'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.friendService.deleteFriend(this.users.id).subscribe(
              () => {
                this.onDelete.emit(this.users.id);
              },
              (error) => {
                console.error('Error during delete:', error);
              }
            );
          },
        },
      ],
    };
    
    this.presentAlert(alertDialog);
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

}
