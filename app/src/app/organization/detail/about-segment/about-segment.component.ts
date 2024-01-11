import { Component, Input, OnInit } from '@angular/core';
import {
  USER_ORGANIZATION_STATUS,
  removeVietnameseTones,
} from 'src/app/constant';
import { ListUsers, UserDetail } from 'src/app/interface/user.interface';
import {
  OrganizationsService,
  IAMGroupService,
  UserService,
} from 'src/app/services';
import {
  OrganizationDataService,
  ResourceAcessDataService,
} from 'src/app/shared/services';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import {
  AlertDialog,
  IOrganization,
  IOrganizationSocial,
} from 'src/app/interface';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OrganizationUserService } from 'src/app/services';
import { query } from '@angular/animations';

@Component({
  selector: 'profile-about-segment',
  templateUrl: './about-segment.component.html',
  styleUrls: ['./about-segment.component.scss'],
})
export class AboutSegmentComponent implements OnInit {
  @Input() organization: any = {};

  showActivity: boolean = false;
  organizationId: string | undefined;

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    offset: this.offset,
    limit: this.limit,
    include: 'organizations,user_organizations',
    q: '',
  };

  constructor(
    private organizationsService: OrganizationsService,
    private iamGroupService: IAMGroupService,
    private resourceAcessDataService: ResourceAcessDataService,
    private organizationDataService: OrganizationDataService,
    private translate: TranslateService,
    private alertController: AlertController,
    private location: Location,
    private route: ActivatedRoute,
    private organizationUserService: OrganizationUserService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.get();
    this.getUsersData(this.query);
  }

  //get user
  getUsersData(query?: string) {
    this.userService
      .getUsersOrg(query, this.organizationId)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.users = res.data;
          if (this.offset + 10 < +res.paging.count) {
            this.limit = +res.paging.limit;
            this.offset = +res.paging.limit;
            this.count = +res.paging.count;
          }
          this.isLoading = false;
        }
      });
  }

  loadUsers(phone_query?: string) {
    let query: any = { ...this.query, offset: this.offset, limit: this.limit };
    if (this.offset < this.count) {
      this.userService
        .getUsersOrg(query, this.organizationId)
        .subscribe((res: ListUsers) => {
          if (res && res.data) {
            this.users = this.users.concat(res.data);
            this.offset += +res.paging.limit;
            this.count = +res.paging.count;
            this.isLoading = false;
          }
        });
    }
  }

  onIonInfinite(ev: any) {
    this.loadUsers();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  get() {
    this.organizationId = this.route.snapshot.paramMap
      .get('organizationId')
      ?.toString();

    if (this.organization.id) {
      // get org
      const orgQuery = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,iam_groups,chapters,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,summary',
      };
      this.organizationsService
        .getOrganization(this.organization.id, orgQuery)
        .subscribe((res) => {
          if (res) {
            this.organizationDataService.setOrganizationDetail(res);
            this.organizationDataService.organizationDetail$.subscribe(
              (org) => {
                this.organization = org;
                this.organization.chapters = _.filter(
                  this.organization.chapters,
                  (chapter) => _.isNull(chapter.deleted_date)
                );
                this.industriesString = this.getIndustryString();
                this.parseSocials(org);
                this.addressString = this.getAddress();
                this.followersString =
                  this.organization.summary?.number_of_followers;
                this.isFollow = this.organization.has_followed;
                this.getUsersBySegment();
                this.isLoading = false;
              }
            );
          }
        });
      this.getIAMGroups();
    }
  }
  socials: any;
  isFollow: any;
  industriesString: any;
  followersString: any;
  isInviteUserModalOpen = false;
  isLoading: any;
  addressString: any;

  parseSocials(org: IOrganization) {
    try {
      this.socials = JSON.parse(org.socials);
    } catch (e) {
      this.socials = {} as IOrganizationSocial;
    }
  }
  showModal: any;
  imagesString: any;

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  openInviteUserModal(isOpen: boolean) {
    this.isInviteUserModalOpen = isOpen;
  }

  hasPermission(permission: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      this.organization.id || '',
      'organization'
    );
  }

  getOrganizationMembers() {
    return this.organization.users?.filter(
      (u: UserDetail) =>
        u.organization_user.status === USER_ORGANIZATION_STATUS.MEMBER
    );
  }

  iamGroups: any;

  getIAMGroups() {
    this.iamGroupService
      .getGroups({ organization_id: this.organization.id })
      .subscribe((res: any) => {
        const validatedIAMGroups =
          this.resourceAcessDataService.getValidatedIAMGroups(
            this.organization.id || '',
            'organization',
            res.data
          );
        this.iamGroups = validatedIAMGroups;
      });
  }

  getIAMGroup() {
    return this.resourceAcessDataService.getIAMGroup(
      this.organization.id || '',
      'organization'
    );
  }
  segmentStatus: any = 0;

  changeSegment(event: any) {
    this.segmentStatus = Number(event.detail.value);
    this.getUsersBySegment();
  }
  users: any[] = [];
  getUsersBySegment() {
    this.users = this.organization.users?.filter(
      (u: UserDetail) => u.organization_user.status === this.segmentStatus
    );
  }

  getIndustryString() {
    return _.map(this.organization.industries, 'name').join(', ');
  }

  getAddress() {
    let addressArray: string[] = [];
    if (this.organization.address?.trim().length > 0) {
      addressArray = [...addressArray, this.organization.address];
    }

    if (this.organization.city?.name) {
      addressArray = [...addressArray, this.organization.city?.name];
    }
    if (this.organization.country?.name) {
      addressArray = [...addressArray, this.organization.country?.name];
    }

    return addressArray.join(', ');
  }

  handleDeleteOrganization() {
    let alertDialog = {
      header: `${this.translate.instant(
        'PAGES.ORGANIZATION.DELETE_ORGANIZATION'
      )}?`,
      message: this.translate.instant(
        'PAGES.ORGANIZATION.DELETE_ORGANIZATION_NOTE'
      ),
      buttons: [
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translate.instant('BUTTON.CONFIRM'),
          role: 'confirm',
          handler: () => {
            this.organizationsService
              .deleteOrganization(this.organization.id)
              .subscribe({
                next: () => {
                  alertDialog = {
                    header: this.translate.instant('NOTIFICATION.HEADER'),
                    message: this.translate.instant(
                      'NOTIFICATION.CONTENT.DELETE_SUCCESS'
                    ),
                    buttons: [
                      {
                        text: this.translate.instant('BUTTON.OK'),
                        role: 'confirm',
                        handler: () => {
                          this.isLoading = false;
                        },
                      },
                    ],
                  };
                  this.location.back();
                  this.presentAlert(alertDialog);
                },
                error: () => {
                  alertDialog = {
                    ...alertDialog,
                    message: this.translate.instant(
                      'NOTIFICATION.CONTENT.DELETE_FAILURE'
                    ),
                    buttons: [
                      {
                        text: this.translate.instant('BUTTON.OK'),
                        role: 'confirm',
                        handler: () => {},
                      },
                    ],
                  };
                  this.presentAlert(alertDialog);
                },
              });
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

  changeUserOrganization(user: UserDetail) {
    console.log(user);
    this.updateOrganizationUser(
      user.organization_user?.position_id || '',
      user.organization_user?.iam_group_id || '',
      user.id
    );
  }

  updateOrganizationUser(
    positionId: string,
    iamGroupId: string,
    userId: string
  ) {
    if (this.organizationId) {
      this.organizationUserService
        .updateOrganizationUsers(
          this.organizationId,
          userId,
          positionId,
          iamGroupId
        )
        .subscribe(() => {
          this.refreshMyOrganizations();
        });
    }
  }

  refreshMyOrganizations() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (!_.isNil(user_id)) {
      const query = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((res) => {
        this.organizationDataService.setMyOrganizations(res.data);
      });
    }
  }

  //search user
  handleSearch(ev: any) {
    const keyword = ev.detail.value.trim();
    this.query = { ...this.query, q: `%${keyword}%` };
    this.getUsersData(this.query);
  }
}
