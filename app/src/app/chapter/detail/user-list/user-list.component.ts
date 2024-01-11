import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetail } from 'src/app/interface/user.interface';
import { IIAMGroup } from '../../../interface';
import * as _ from 'lodash';
import {
  MasterDataService,
  ResourceAcessDataService,
  ChapterDataService,
} from '../../../shared/services';

@Component({
  selector: 'app-user-list-chapter-detail',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListChapterDetailComponent implements OnInit {
  @Input() users: UserDetail[] = [];

  @Input() allowRedirect: boolean = true;
  @Input() isSelectCheckbox: boolean = false;
  @Input() isLoading: boolean = true;

  @Output() arrayUserIdChecked: EventEmitter<string[]> = new EventEmitter();
  @Output() changeUserChapter: EventEmitter<UserDetail> = new EventEmitter();
  @Output() getThumbnail = new EventEmitter<string>();

  iamGroups: IIAMGroup[] = [];

  updateAvatar: boolean = false;
  isAvatar: boolean = true;
  classNameAvatar: string = 'list';

  constructor(
    private router: Router,
    private route: ActivatedRoute,

    private masterDataService: MasterDataService,
    private resourceAcessDataService: ResourceAcessDataService,
    private chapterDataService: ChapterDataService
  ) {
    this.getIAMGroups();
  }

  ngOnInit() {}

  actionRedirect(user: UserDetail) {
    if (this.allowRedirect) {
      this.router.navigate(['/tabs', 'users', user.id]);
    }
  }

  getChapterId() {
    return this.route.snapshot.paramMap.get('id')?.toString() || '';
  }

  hasPermission(permission: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      this.getChapterId(),
      'chapter'
    );
  }

  getIAMGroups() {
    this.chapterDataService.iamGroups$.subscribe((groups) => {
      this.iamGroups = groups;
    });
  }

  actionChangeIAMGroup(group: IIAMGroup, user: UserDetail, iamGroupModal: any) {
    if (user.user_chapter) {
      const iamGroupId = group.id;
      user['user_chapter'] = {
        ...user['user_chapter'],
        iam_group:
          _.find(this.iamGroups, (group) => group.id === iamGroupId) ||
          ({} as IIAMGroup),
        iam_group_id: iamGroupId,
      };
      this.changeUserChapter.emit(user);
      iamGroupModal.close();
    }
  }

  getDefaultIAMGroupId() {
    const iamGroup = _.find(this.iamGroups, (group) => !group.level);
    return _.get(iamGroup, 'id');
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  getMeIAMGroupLevel() {
    return (
      this.resourceAcessDataService.getIAMGroup(
        this.route.snapshot.params['id'],
        'chapter'
      ).level || 0
    );
  }

  getIAMGroupById(id: string) {
    return (
      _.find(this.iamGroups, (group) => group.id === id) || ({} as IIAMGroup)
    );
  }

  isIAMGroupAdmin(id: string) {
    return _.includes([2, 1], this.getIAMGroupById(id)?.level);
  }

  arrayUserId: string[] = [];
  changeCheckbox(event: any, id: string) {
    if (this.arrayUserId.length === 0) this.arrayUserId.push(id);
    else {
      if (event.target.checked) {
        this.arrayUserId.map((el) => {
          if (el === id) return;
          else this.arrayUserId.push(id);
        });
      } else {
        this.arrayUserId = this.arrayUserId.filter((el) => el !== id);
      }
    }
    this.arrayUserIdChecked.emit(this.arrayUserId);
  }

  getSrcImage(thumbnail: string) {
    this.getThumbnail.emit(thumbnail);
  }
}
