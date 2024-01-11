import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CreateFollowParams } from 'src/app/interface';
import { FollowService, FriendService } from 'src/app/services';
import { GroupService } from 'src/app/services/group.service';
import { MasterDataService } from '../../services';

@Component({
  selector: 'app-user-segment',
  templateUrl: './user-segment.component.html',
  styleUrls: ['./user-segment.component.scss'],
})
export class UserSegmentComponent implements OnInit {
  @Input() user: any;

  me: any;
  showButton: boolean = false;
  isButtonFriend: boolean = false;
  isFollowing: boolean = false;
  isAlertOpen: boolean = false;

  constructor(
    private groupService: GroupService,
    private followService: FollowService,
    private friendService: FriendService,
    private translate: TranslateService,
    private alertController: AlertController,
    private router: Router,
    private masterDataService: MasterDataService,
  ) {}

  ngOnInit() {
    this.getMe();
  }

  getMe() {
    this.masterDataService.me$.subscribe((res: any) => {
     this.me = res;
    });
  }

  //message
  async sendMessage(ev: any) {
    const groupData = {
      is_private: 1,
      member_ids: [ev.id],
    };
    this.groupService.createGroup(groupData).subscribe((res) => {
      this.router.navigate(['/group', res.id]);
    });
  }

  followUser(id: string) {
    this.isFollowing = true;
    let params: CreateFollowParams = {
      resource_id: id,
      resource_type: 'user',
    };

    this.followService.addFollow(params).subscribe((res) => {
      if (res) {
        this.user.has_followed = true;
        this.isFollowing = false;
      }
    });
  }

  request(id: string) {
    this.isButtonFriend = true;
    this.friendService.request(id).subscribe(
      (res) => {
        this.user.has_requested = true;
        this.user.has_followed = true;
        this.isButtonFriend = false;
      },
      (error) => {
        this.presentAlert();
        this.user.has_requested = false;
        this.user.has_followed = false;
        this.isButtonFriend = false;
      }
    );
  }

  unRequest(id: string) {
    this.isButtonFriend = true;
    this.friendService.unRequest(id).subscribe(
      (res) => {
        this.user.has_requested = false;
        this.isButtonFriend = false;
      },
      (error) => {
        this.presentAlert();
        this.isButtonFriend = false;
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('PAGES.USER_INFO.ALERT.HEADER'),
      message: this.translate.instant('PAGES.USER_INFO.ALERT.MESSAGE'),
      buttons: [this.translate.instant('BUTTON.OK')],
    });

    await alert.present();
  }
}
