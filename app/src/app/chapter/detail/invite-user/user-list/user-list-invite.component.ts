import { Component, Input } from '@angular/core';
import { UserDetail } from 'src/app/interface/user.interface';
import { IIAMGroup } from '../../../../interface';
import * as _ from 'lodash';
import {
  ChapterDataService,
  MasterDataService,
} from '../../../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { ChapterService } from '../../../../services/chapter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list-chapter-invite',
  templateUrl: './user-list-invite.component.html',
  styleUrls: ['./user-list-invite.component.scss'],
})
export class UserListChapterInviteComponent {
  @Input() users: any = [];
  @Input() single: boolean = true;

  iamGroups: IIAMGroup[] = [];
  values: string[] = [];
  chapterMembers: UserDetail[] = [];

  toastMessage: string = '';
  classNameAvatar: string = 'list';

  isAvatar: boolean = true;

  constructor(
    private chapterDataService: ChapterDataService,
    private chapterService: ChapterService,
    private masterDataService: MasterDataService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.getIAMGroups();
    this.getChapterDetail();
  }

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

  sendInvite(data: any) {
    const params = data;
    this.chapterService
      .inviteUserChapter(this.route.snapshot.params['id'], params)
      .subscribe(
        () => {
          this.refreshChapter();
          this.toastMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.ADD_SUCCESS'
          );
        },
        () => {
          this.toastMessage = this.translate.instant(
            'NOTIFICATION.CONTENT.ADD_FAILURE'
          );
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
}
