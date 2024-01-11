import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from '../../../../interface';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { MasterDataService } from 'src/app/shared/services';
import { FriendService } from 'src/app/services';

@Component({
  selector: 'app-member-action',
  templateUrl: './member-action.component.html',
  styleUrls: ['./member-action.component.scss'],
})
export class MemberActionComponent implements OnInit {
  isOpen = false;
  groupId: string = '';
  @Input() user: any;
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private router: Router,
    private groupService: GroupService,
    private masterDataService: MasterDataService,
    private friendService : FriendService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      if (groupId !== null) {
        this.groupId = groupId;
      }
    })
  }

  close() {
    this.isOpen = false;
  }

  open(user: any) {
    this.isOpen = true;
    this.user = user;
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  onDeleteMember() {
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            const data = {
              resource_id: this.groupId,
              resource_type: "User_MessageGroup",
            };
            this.friendService.blockConversation(data).subscribe();
          },
        },
      ],
    };
    this.isOpen = false;
    this.presentAlert(alertDialog);
  }

  onBlock(user : any) {
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
              message_group_id : this.groupId,
              resource_id: this.user.id,
              resource_type: "MessageGroup_User",
            };
            this.friendService.blockConversation(data).subscribe();
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

  
  leaveGroup() {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      if (groupId !== null) {
        this.groupId = groupId;
      }
    })
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.groupService.deleteMember(this.groupId).subscribe(
              () => {
                this.router.navigate(['tabs/connect']);
              },
              (error) => {
                console.error('Error during delete:', error);
              }
            );
          },
        },
      ],
    };
    this.isOpen = false;
    this.presentAlert(alertDialog);
  }

  updateUsertoAdmin(){
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      if (groupId !== null) {
        this.groupId = groupId;
      }
    })
    let updateUser = {
      "user_id": this.user.id,
      "group_id": this.groupId,
      "name": "Message",
      "hidden_setting": 0,
      "status": 0,
      "role": "ADMIN"
    }
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('TAB.MESSAGE.UPDATE_ADMIN_USER'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.groupService.updateAdmin(this.user.memberId, updateUser).subscribe(
              () => {
              },
              (error) => {
                console.error('Error during delete:', error);
              }
            );
          },
        },
      ],
    };
    this.isOpen = false;
    this.presentAlert(alertDialog);
  }

  redirectUserDetail() {
    this.isOpen = false;
    setTimeout(() => {
      this.router.navigate(['/tabs', 'users', this.user.id]);
    }, 500);
  }
}
