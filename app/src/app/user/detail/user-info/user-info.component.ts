import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateFollowParams } from 'src/app/interface';
import { FollowService, FriendService } from 'src/app/services';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'detail-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Input() user: any = {};
  @Output() reloadData = new EventEmitter();
  isAdmin: boolean = false;
  isLoading: boolean = true;
  isAvatar: boolean = true;
  followers: number = 0;
  followings: number = 0;
  isFollowing: boolean = false;
  isFollow: boolean = false;
  showButton: boolean = false;
  isButtonFriend: boolean = false;
  isAlertOpen: boolean = false;

  isShowListFollow: boolean = false;
  listType: string = '';

  constructor(
    private router: ActivatedRoute,
    private followService: FollowService,
    private friendService: FriendService,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}

  public alertButtons = [
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
    },
    {
      text: this.translate.instant('BUTTON.CONFIRM'),
      role: 'confirm',
    },
  ];

  ngOnInit() {
    this.showButton =
      JSON.parse(localStorage.getItem('user') || '{}')?.id ===
      this.router.snapshot.params['id'];
    this.followers = this.user.summary?.number_of_followers;
    this.followings = this.user.summary?.number_of_followings;
    if (this.user.user_type) {
      this.isAdmin = true;
    }
    this.isLoading = false;
  }

  showModal: boolean = false;
  imagesString: string = '';
  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  followUser(id: string) {
    this.isFollowing = true;
    let params: CreateFollowParams = {
      resource_id: id,
      resource_type: 'user',
    };
    if (!this.user.has_followed) {
      this.followService.addFollow(params).subscribe((res) => {
        this.user.has_followed = true;
        this.followers = this.followers + 1;
        this.isFollowing = false;
      });
    } else {
      this.followService.unFollow(id).subscribe((res) => {
        this.user.has_followed = false;
        this.followers = this.followers - 1;
        this.isFollowing = false;
      });
    }
  }

  request(id: string) {
    this.isButtonFriend = true;
    this.friendService.request(id).subscribe(
      (res) => {
        this.user.receiver_request_from_me = true;
        if (!this.user.has_followed) {
          this.user.has_followed = true;
          this.followers = this.followers + 1;
        }
        this.isButtonFriend = false;
      },
      (error) => {
        this.presentAlert();
        this.user.send_request_to_me = true;
        this.isButtonFriend = false;
      }
    );
  }

  responseRequest(event: any, id: string) {
    if (event.detail.value === 'accept') {
      this.accept(id);
    } else {
      this.reject(id);
    }
  }

  unRequest(id: string) {
    this.isButtonFriend = true;
    this.friendService.unRequest(id).subscribe(
      (res) => {
        this.user.receiver_request_from_me = false;
        this.user.has_friended = false;
        this.isButtonFriend = false;
      },
      (error) => {
        this.presentAlert();
        this.reloadData.emit(id);
        this.isButtonFriend = false;
      }
    );
  }

  accept(id: string) {
    this.isButtonFriend = true;
    this.friendService.accept(id).subscribe(
      (res) => {
        this.user.send_request_to_me = false;
        this.user.has_friended = true;
        this.isButtonFriend = false;
      },
      (error) => {
        this.presentAlert();
        this.user.send_request_to_me = false;
        this.isButtonFriend = false;
      }
    );
  }

  reject(id: string) {
    this.isButtonFriend = true;
    this.friendService.reject(id).subscribe(
      (res) => {
        this.user.send_request_to_me = false;
        this.user.has_friended = false;
        this.isButtonFriend = false;
      },
      (error) => {
        this.presentAlert();
        this.user.send_request_to_me = false;
        this.isButtonFriend = false;
      }
    );
  }

  unfriend(id: string) {
    this.isButtonFriend = true;
    this.friendService.deleteFriend(id).subscribe((res) => {
      this.user.has_friended = false;
      this.isButtonFriend = false;
    });
  }

  setOpenListFollower(value: boolean) {
    this.isShowListFollow = value;
    this.listType = 'follower';
  }

  setOpenListFollowing(value: boolean) {
    this.isShowListFollow = value;
    this.listType = 'following';
  }

  setOpen(value: boolean) {
    this.isShowListFollow = value;
  }

  setOpenAlert(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  setResult(ev: any, id: string) {
    const event = ev?.detail?.role;
    if (event === 'confirm') {
      this.unfriend(id);
    }
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
