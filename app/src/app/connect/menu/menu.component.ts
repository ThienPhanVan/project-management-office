import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GROUP_THUMBNAIL_URL } from '../../constant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { AlertDialog } from 'src/app/interface';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataService } from 'src/app/shared/services';

@Component({
  selector: 'app-menu-group',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuGroupComponent implements OnInit {
  @Output() close = new EventEmitter();

  isLoading: boolean = true;
  updateAvatar: boolean = true;
  isAvatar: boolean = true;
  isUploadImage: boolean = false;
  imagesString: string = '';
  showZoomAvatar: boolean = false;
  groupId: string = '';
  memberCount!: number;
  memberId: string = '';
  user : any
  limit = 10;
  offset = 0;
  count = 0;

  GROUP_THUMBNAIL_URL = GROUP_THUMBNAIL_URL;

  group: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private alertController: AlertController,
    private translate: TranslateService,
    private masterDataService: MasterDataService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/tabs/connect') {
          this.route.paramMap.subscribe((params) => {
            const groupId = params.get('groupId');
            if (groupId !== null) {
              this.groupId = groupId;
              this.getGroupById(groupId);
              this.getMemberCount();
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      if (groupId !== null) {
        this.groupId = groupId;
        this.getGroupById(groupId);
        this.getMemberCount();
      }
    });
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }


  isOpen = false;

  leaveGroup() {
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('TAB.MESSAGE.LEAVE_GROUP_QUESTION'),
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

  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }

  getGroupById(id: string) {
    this.groupService.getGroupById(id).subscribe((res) => {
      this.group = res;
    });
  }

  getMemberCount() {
    this.groupService.getMemberList(this.groupId).subscribe((res) => {
      this.memberCount = res.paging.count;
      if(res.paging.count === 2){
        if(res.data[1].user.id === this.getMyId()){
          this.user =res.data[0].user
        }
        else {
          this.user = res.data[1].user
        }
      }
    });
  }

  actionClose() {
    this.close.emit();
  }

  async setCoverImage(event: any) {
    this.isUploadImage = true;
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }
  }

  getSrcImage(thumbnail: string) {
    this.showZoomAvatar = true;
    this.imagesString = thumbnail;
  }

  closeZoom(value: boolean) {
    this.showZoomAvatar = value;
    this.imagesString = '';
  }
}
