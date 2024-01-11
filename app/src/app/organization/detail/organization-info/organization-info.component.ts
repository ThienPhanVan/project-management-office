import * as _ from 'lodash';

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrganizationSocial, IIAMGroup, CreateFollowParams, IOrganization } from 'src/app/interface';
import { UserDetail } from 'src/app/interface/user.interface';
import { OrganizationsService, FollowService, IAMGroupService } from 'src/app/services';
import { NewsService } from 'src/app/services/news.service';
import { OrganizationUserService } from 'src/app/services/organization-user.service';
import { ResourceAcessDataService, OrganizationDataService, NewsDataService } from 'src/app/shared/services';
import { Location } from '@angular/common';

@Component({
  selector: 'detail-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss'],
})
export class OrganizationInfoComponent  implements OnInit {

  organizationId: string | undefined;
  @Input() organization: any = {};

  socials: IOrganizationSocial = {} as IOrganizationSocial;
  users: UserDetail[] = [];
  iamGroups: IIAMGroup[] = [];

  industriesString: string = '';
  addressString: string = '';
  followersString: number = 0;
  imagesString: string = '';

  segmentStatus: number = 0;

  isLoading: boolean = true;
  isBackground: boolean = true;
  isLogo: boolean = true;
  showModal: boolean = false;
  isInviteUserModalOpen: boolean = false;
  isFollow: boolean = false;
  isFollowing: boolean = false;
  isShowListFollow: boolean = false;

  constructor(
    private organizationsService: OrganizationsService,
    private followService: FollowService,
    private location: Location,
    private route: ActivatedRoute,
    private organizationUserService: OrganizationUserService,
    private iamGroupService: IAMGroupService,
    private resourceAcessDataService: ResourceAcessDataService,
    private organizationDataService: OrganizationDataService,
    private router: Router,
    private newsDataService: NewsDataService,
    private newsService: NewsService) { }

  ngOnInit() {
    this.organization.chapters = _.filter(
      this.organization.chapters,
      (chapter) => _.isNull(chapter.deleted_date)
    );
    this.industriesString = this.getIndustryString();
    this.parseSocials(this.organization);
    this.addressString = this.getAddress();
    this.followersString =
      this.organization.summary?.number_of_followers;
    this.isFollow = this.organization.has_followed;
  }

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  followOrganization(id: string) {
    this.isFollowing = true;
    let params: CreateFollowParams = {
      resource_id: id,
      resource_type: 'organization',
    };

    if (!this.isFollow) {
      this.followService.addFollow(params).subscribe((res) => {
        this.isFollow = true;
        this.followersString = this.followersString + 1;
        this.isFollowing = false;
      });
    } else {
      this.followService.addFollow(params).subscribe((res) => {
        this.isFollow = false;
        this.followersString = this.followersString - 1;
        this.isFollowing = false;
      });
    }
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

  parseSocials(org: IOrganization) {
    try {
      this.socials = JSON.parse(org.socials);
    } catch (e) {
      this.socials = {} as IOrganizationSocial;
    }
  }

  setOpen(value: boolean) {
    this.isShowListFollow = value;
  }
}
