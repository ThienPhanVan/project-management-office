import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import {
  CreateFollowParams,
  IIAMGroup,
  IOrganization,
  IOrganizationSocial,
} from 'src/app/interface';
import { OrganizationsService } from 'src/app/services/organization.service';
import {
  AuthService,
  FollowService,
  IAMGroupService,
  UserService,
} from '../../services';
import { ListUsers, UserDetail } from '../../interface/user.interface';
import { OrganizationUserService } from '../../services/organization-user.service';
import {
  ResourceAcessDataService,
  OrganizationDataService,
  NewsDataService,
} from '../../shared/services';
import { Location } from '@angular/common';
import { USER_ORGANIZATION_STATUS, convertDataNewsList } from '../../constant';
import { NewsService } from 'src/app/services/news.service';
import { TranslateService } from '@ngx-translate/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  @ViewChild('fab', { read: ElementRef }) fab!: ElementRef;
  fabListOpen: boolean = false;
  organizationId: string | undefined;
  organization: any = {};
  buttonCommerceOrg = [
    {
      type: '0',
      title: 'TAB.HOME.CHILD.OPPORTUNITY',
      icon: 'bulb-outline',
    },
    {
      type: '1',
      title: 'TAB.HOME.CHILD.EVENT',
      icon: 'calendar-number-outline',
    },
    {
      type: '2',
      title: 'TAB.HOME.CHILD.NEWS',
      icon: 'newspaper-outline',
    },
    {
      type: '3',
      title: 'TAB.COMMERCE.TITLE',
      icon: 'add-circle-outline',
    },
  ];
  isAvailableUser = false;
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

  selectedSegment = 'about';

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    type: '',
  };
  me: any;

  constructor(
    private organizationsService: OrganizationsService,
    private followService: FollowService,
    private location: Location,
    private route: ActivatedRoute,

    private translate: TranslateService,
    private organizationUserService: OrganizationUserService,
    private iamGroupService: IAMGroupService,
    private resourceAcessDataService: ResourceAcessDataService,
    private organizationDataService: OrganizationDataService,
    private router: Router,
    private newsDataService: NewsDataService,
    private newsService: NewsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.get();
    this.getMe();
    let urlName = localStorage.getItem('url');
    if (urlName === 'cart') {
      this.selectedSegment = 'commerce';
    }
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  // hidden button create when scroll or click

  toggleFabList() {
    this.fabListOpen = true;
  }

  @HostListener('document:mousewheel', ['$event'])
  closeFabListOnScroll(event: any) {
    if (!this.fab.nativeElement.contains(event.target)) {
      this.fab.nativeElement.close();
      this.fabListOpen = false;
    }
  }
  @HostListener('document:click', ['$event'])
  closeFabListOnClickOutside(event: any) {
    if (!this.fab.nativeElement.contains(event.target)) {
      this.fab.nativeElement.close();
      this.fabListOpen = false;
    }
  }

  get() {
    this.organizationId = this.route.snapshot.paramMap
      .get('organizationId')
      ?.toString();
    if (this.organizationId) {
      // get org
      const orgQuery = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,iam_groups,chapters,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,summary',
      };
      this.organizationsService
        .getOrganization(this.organizationId, orgQuery)
        .subscribe(
          (res) => {
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
          },
          (error) => {
            this.router.navigate(['/not-found']);
          }
        );
      this.getIAMGroups();
    }
  }

  parseSocials(org: IOrganization) {
    try {
      this.socials = JSON.parse(org.socials);
    } catch (e) {
      this.socials = {} as IOrganizationSocial;
    }
  }

  openInviteUserModal(isOpen: boolean) {
    this.isInviteUserModalOpen = isOpen;
  }

  getIAMGroups() {
    this.iamGroupService
      .getGroups({ organization_id: this.organizationId })
      .subscribe((res: any) => {
        const validatedIAMGroups =
          this.resourceAcessDataService.getValidatedIAMGroups(
            this.organizationId || '',
            'organization',
            res.data
          );
        this.iamGroups = validatedIAMGroups;
      });
  }

  goBack() {
    // localStorage.removeItem('searchQueryProducts');
    // localStorage.removeItem('searchQueryNews');
    this.location.back();
  }

  changeSegment(event: any) {
    localStorage.removeItem('url');
    this.selectedSegment = event.detail.value;
  }

  getUsersBySegment() {
    // this.users = this.organization.users?.filter(
    //   (u: UserDetail) => u.organization_user.status === this.segmentStatus
    // );
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.organization.users?.filter((u: UserDetail) => {
      if (u.id === user.id) {
        this.isAvailableUser = true;
      }
    });
  }

  getOrganizationMembers() {
    return this.organization.users?.filter(
      (u: UserDetail) =>
        u.organization_user.status === USER_ORGANIZATION_STATUS.MEMBER
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

  changeUserOrganization(user: UserDetail) {
    this.updateOrganizationUser(
      user.organization_user?.position_id || '',
      user.organization_user?.iam_group_id || '',
      user.id
    );
  }

  getIAMGroup() {
    return this.resourceAcessDataService.getIAMGroup(
      this.organizationId || '',
      'organization'
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
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,organization_users_user_invited,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((orgs) => {
        this.organizationDataService.setMyOrganizations(orgs.data);
      });
    }
  }

  isObjectEmpty(obj: any) {
    return !_.includes(_.keys(obj), 'id');
  }

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  // redirectNewsOrg() {
  //   this.router.navigate([`/tabs/news/org/${this.organizationId}`]);
  // }

  onClickCreateCommerce(type: number) {
    localStorage.removeItem('url');
    const typeString = type.toString();
    this.query = {
      include:
        'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
      limit: 10,
      offset: 0,
      type: typeString,
      organization_id: this.organizationId,
    };

    if (Number(this.query.type) <= 2) {
      localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
    }

    if (this.query.type === '1') {
      this.router.navigate([`/tabs/organizations/event/create`]);
    } else if (this.query.type === '0') {
      this.router.navigate([`/tabs/organizations/opportunity/create`]);
    } else if (this.query.type === '2') {
      this.router.navigate([`/tabs/organizations/news/create`]);
    } else {
      const query = {
        limit: 10,
        offset: 0,
        include: 'author,summary,user,product_category,images',
        organization_id: this.organizationId,
      };
      localStorage.setItem('searchQueryProducts', JSON.stringify(query));
      this.router.navigate([`/tabs/organizations/commerce/create`]);
    }
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

  redirectNewsUser(value: number) {
    localStorage.removeItem('url');
    //
    if (value <= 2) {
      let query: any = {
        q: '',
        limit: 10,
        offset: 0,
        include:
          'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
        type: value === 0 ? '0' : value === 1 ? '1' : '2',
        organization_id: this.organization.id,
      };
      localStorage.setItem('searchQueryNews', JSON.stringify(query));
      localStorage.setItem('createNewsType', '2');
      this.getNewsList(query);
      this.router.navigate([`/tabs/news/org/${this.organization.id}`]);
    } else {
      const query: {
        q?: string;
        limit: number;
        offset: number;
        include?: string;
        name?: string;
        user_id?: string;
        organization_id?: string;
        chapter_id?: string;
        product_category_id?: string;
        author_id?: string;
      } = {
        limit: 10,
        offset: 0,
        include: 'author,summary,user,product_category,images',
        organization_id: this.organization.id,
      };
      localStorage.setItem('searchQueryProducts', JSON.stringify(query));
      this.router.navigate([`/tabs/commerce/org/${this.organization.id}`]);
    }
  }

  getNewsList(query: any) {
    this.newsDataService.setMyNewsFilter(query);
    this.newsService.getNews(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);

        this.newsDataService.setMyNews(data);
      }
    });
  }
}
