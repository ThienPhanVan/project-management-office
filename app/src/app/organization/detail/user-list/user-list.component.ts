import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDetail } from 'src/app/interface/user.interface';
import { CreateFollowParams, IIAMGroup, IPosition } from '../../../interface';
import { AlertController, IonModal } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MasterDataService,
  ResourceAcessDataService,
} from '../../../shared/services';
import * as _ from 'lodash';
import { GroupService } from 'src/app/services/group.service';
import { FollowService, FriendService } from 'src/app/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list-organization',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListOrganizationComponent implements OnInit {
  @Input() iamGroups: IIAMGroup[] = [];
  @Input() users: UserDetail[] = [];

  @Input() allowRedirect: boolean = true;
  @Input() isSelectCheckbox: boolean = false;
  @Input() isLoading: boolean = true;

  @Output() arrayUserIdChecked: EventEmitter<string[]> = new EventEmitter();
  @Output() changeUserOrganization: EventEmitter<UserDetail> =
    new EventEmitter();
  @Output() getThumbnail = new EventEmitter<string>();

  organizationId: string = '';
  classNameAvatar: string = 'list';

  isAvatar: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
    private resourceAcessDataService: ResourceAcessDataService
  ) {
    this.getOrganizationId();
  }

  ngOnInit(): void {}

  getOrganizationId() {
    this.organizationId =
      this.route.snapshot.paramMap.get('organizationId')?.toString() || '';
  }

  hasPermission(permission: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      this.organizationId,
      'organization'
    );
  }

  actionChangePosition(
    position: IPosition,
    user: UserDetail,
    modalPosition: IonModal
  ) {
    user['organization_user'] = {
      ...user['organization_user'],
      position: position,
      position_id: position.id,
    };

    this.changeUserOrganization.emit(user);
    modalPosition.dismiss();
  }

  getDefaultIAMGroupId() {
    const iamGroup = _.find(this.iamGroups, (group) => !group.level);
    return _.get(iamGroup, 'id');
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  actionChangeIAMGroup(group: IIAMGroup, user: UserDetail) {
    const iamGroupId = group.id;
    if (user.organization_user) {
      user['organization_user'] = {
        ...user['organization_user'],
        iam_group:
          _.find(this.iamGroups, (group) => group.id === iamGroupId) ||
          ({} as IIAMGroup),
        iam_group_id: iamGroupId,
      };
      this.changeUserOrganization.emit(user);
    }
  }

  actionRedirect(user: UserDetail) {
    if (this.allowRedirect) {
      this.router.navigate(['/tabs', 'users', user.id]);
    }
  }

  getIAMGroupNameById(id: string) {
    return _.find(this.iamGroups, (group) => group.id === id)?.name || '';
  }

  getIAMGroupById(id: string) {
    return _.find(this.iamGroups, (group) => group.id === id);
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
