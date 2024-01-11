import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ChildActivationStart,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { FollowService, FriendService, UserService } from 'src/app/services';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  buttons = [
    {
      type: '0',
      title: this.translate.instant('TAB.HOME.CHILD.OPPORTUNITY'),
      icon: 'bulb-outline',
    },
    {
      type: '1',
      title: this.translate.instant('TAB.HOME.CHILD.EVENT'),
      icon: 'calendar-number-outline',
    },
    {
      type: '2',
      title: this.translate.instant('TAB.HOME.CHILD.NEWS'),
      icon: 'newspaper-outline',
    },
    {
      type: '3',
      title: this.translate.instant('TAB.COMMERCE.TITLE'),
      icon: 'add-circle-outline',
    },
  ];

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

  user: any = {
    id: null,
    name: null,
    description: null,
    display_order: null,
    color: null,
    code: null,
    created_date: null,
    created_by: null,
    updated_date: null,
    email: null,
    phone: null,
    address: null,
    thumbnail: null,
    user_type: 0,
    organization_id: null,
    username: null,
    has_followed: null,
    has_friended: null,
    verified_flag: 0,
  };

  isAdmin: boolean = false;
  isLoading: boolean = true;
  isAvatar: boolean = true;
  followers: number = 0;
  followings: number = 0;
  isFollowing: boolean = false;
  isFollow: boolean = false;
  isSendRequest: boolean = false;
  isReceiverRequest: boolean = false;
  isShowListFollow: boolean = false;

  isButtonFriend: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private followService: FollowService,
    private friendService: FriendService,
    private route: Router,
    private translate: TranslateService
  ) {}

  previousUrl: string = '';
  ngOnInit() {
    this.getDataUser();

    let urlName = localStorage.getItem('url');
    if (urlName === 'cart') {
      this.selectedSegment = 'commerce';
    }
  }

  getDataUser() {
    this.userService.getUser(this.router.snapshot.params['id']).subscribe(
      (res: any) => {
        if (res) {
          this.user = res;
          this.followers = res.summary?.number_of_followers;
          this.followings = res.summary?.number_of_followings;
          if (this.user.user_type) {
            this.isAdmin = true;
          }
          this.isLoading = false;
        }
      },
      (error) => {
        this.route.navigate(['/not-found']);
      }
    );
  }
  selectedSegment: string = 'timeline';

  changeSegment(event: any) {
    localStorage.removeItem('url');
    this.selectedSegment = event.detail.value;
  }

  goBack() {
    localStorage.removeItem('url');
    this.location.back();
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

  //click create news for type
  onClickCreate(type: string) {
    this.query = {
      ...this.query,
      type,
    };
    localStorage.removeItem('url');
    localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
    if (type === '1') {
      this.route.navigate(['/tabs/events/create']);
    } else if (type === '0') {
      this.route.navigate(['/tabs/opportunities/create']);
    } else if (type === '2') {
      this.route.navigate(['/tabs/news/create']);
    } else this.route.navigate(['/tabs/commerce/create']);
  }

  reloadData(event: any) {
    this.getDataUser();
  }
}
