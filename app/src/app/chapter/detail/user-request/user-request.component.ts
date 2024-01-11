import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog, IIAMGroup } from 'src/app/interface';
import { UserDetail } from 'src/app/interface/user.interface';
import { ChapterService } from 'src/app/services';
import { ChapterDataService, MasterDataService } from 'src/app/shared/services';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.scss'],
})
export class UserRequestComponent implements OnInit {
  @Input() users: any = [];
  @Input() single: boolean = true;

  iamGroups: IIAMGroup[] = [];
  values: string[] = [];
  chapterMembers: UserDetail[] = [];
  chapter: any;

  toastMessage: string = '';
  classNameAvatar: string = 'list';

  isAvatar: boolean = true;

  constructor(
    private chapterDataService: ChapterDataService,
    private chapterService: ChapterService,
    private masterDataService: MasterDataService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private alertController: AlertController
  ) {
    this.getIAMGroups();
    this.getChapterDetail();
  }

  ngOnInit() {}

  getIAMGroups() {
    this.chapterDataService.iamGroups$.subscribe((iamGroups) => {
      this.iamGroups = iamGroups;
    });
  }

  getOrganizationMembers() {
    return _.filter(this.users, (user) => {
      return user.organization_user?.status === 0;
    });
  }

  getChapterDetail() {
    this.chapterDataService.chapterDetail$.subscribe((chapter) => {
      this.chapter = chapter;
      this.chapterMembers = chapter.users;
    });
  }

  isChapterMember(user: UserDetail) {
    return _.includes(_.map(this.chapterMembers, 'id'), user.id);
  }

  getIAMGroupId(user: UserDetail) {
    if (user.id) {
      if (!user.user_chapter?.iam_group_id) {
        const member = _.find(
          this.chapterMembers,
          (member) => member.id === user.id
        );
        return (
          _.get(member, 'user_chapter.iam_group_id') ||
          this.getDefaultIAMGroupId()
        );
      } else {
        return user.user_chapter.iam_group_id;
      }
    }
    return this.getDefaultIAMGroupId();
  }

  getDefaultIAMGroupId() {
    const iamGroup = _.find(this.iamGroups, (group) => !group.level);
    return _.get(iamGroup, 'id');
  }

  actionInviteMultiple() {
    _.forEach(this.users, (user) => {
      if (_.includes(this.values, user.id)) {
        user.isInvited = true;
        return user;
      }
    });
    const requestData = {
      user_ids: this.values,
      iam_group_id: this.getDefaultIAMGroupId(),
    };

    this.values = [];
    this.sendInvite(requestData);
  }

  actionInviteSingle(user: UserDetail) {
    user.isInvited = true;
    const requestData = {
      user_ids: [user.id],
      iam_group_id: this.getIAMGroupId(user),
    };

    this.sendInvite(requestData);
  }

  cancelInviteSingle(user: any) {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.CANCEL_MEMBER'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.chapterService
              .cancelJoinChapter(user.request_id)
              .subscribe((res) => {
                if (res) {
                  this.users = _.filter(this.users, (item) => {
                    return item.id !== user.id;
                  });
                }
              });
          },
        },
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
      ],
    };

    this.presentAlert(alertDialog);
  }

  sendInvite(data: any) {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: '',
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {},
        },
      ],
    };
    const params = data;
    this.chapterService
      .inviteUserChapter(this.route.snapshot.params['id'], params)
      .subscribe(
        () => {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant('NOTIFICATION.CONTENT.ADD_SUCCESS'),
            buttons: [
              {
                text: this.translate.instant('BUTTON.OK'),
                role: 'confirm',
                handler: () => {
                  this.refreshChapter();
                },
              },
            ],
          };
          this.presentAlert(alertDialog);
        },
        () => {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant('NOTIFICATION.CONTENT.ADD_FAILURE'),
          };
          this.presentAlert(alertDialog);
        }
      );
  }

  refreshChapter() {
    this.chapterService
      .getChapter(this.route.snapshot.params['id'])
      .subscribe((res) => {
        this.chapterDataService.setChapterDetail({
          ...res,
          updated_date: this.convertDate(res.updated_date),
        });
      });
  }

  convertDate(value: string) {
    var d = new Date(value),
      dformat =
        [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
        ' ' +
        [d.getHours(), d.getMinutes()].join(':');
    return dformat;
  }

  actionChangeIAMGroup(group: IIAMGroup, user: UserDetail) {
    const iamGroupId = group.id;
    user['user_chapter'] = {
      ...user['user_chapter'],
      iam_group:
        _.find(this.iamGroups, (group) => group.id === iamGroupId) ||
        ({} as IIAMGroup),
      iam_group_id: iamGroupId,
    };
  }

  changeCheckbox(event: any, id: string) {
    if (event.detail.checked) {
      this.values.push(id);
    } else {
      _.pull(this.values, id);
    }
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  closeToast() {
    this.toastMessage = '';
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
