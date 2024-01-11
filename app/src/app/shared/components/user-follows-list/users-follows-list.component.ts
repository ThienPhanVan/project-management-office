import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { FollowService } from '../../../services';
import * as _ from 'lodash';
import { UserDetail } from 'src/app/interface/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-follows',
  templateUrl: './users-follows-list.component.html',
  styleUrls: ['./users-follows-list.component.scss'],
})
export class UsersFollowsComponent implements OnInit {
  @Input() data: any;
  @Input() type: any;
  @Input() resource_type: any;

  @Output() setOpen: EventEmitter<boolean> = new EventEmitter();
  isAvatar: boolean = true;

  showModal: boolean = false;
  imagesString: string = '';
  countFollows: number = 0;

  user: any;
  userFollows: any[] = [];
  isLoading: boolean = false;
  selectList: string = '';

  query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
    resource_type?: string;
    user_following_id?: string;
    user_id?: string;
    organization_id?: string;
  } = {
    limit: 10,
    offset: 0,
    resource_id: '',
    q: '',
  };

  countPar: number = 0;
  queryPar: {
    offset: number;
    limit: number;
    q?: string;
    include: string;
    user_id?: string;
  } = {
    limit: 10,
    offset: 0,
    include: 'user,news',
  };

  constructor(
    private followService: FollowService,
    private router: Router,
    private ctrl: ModalController
  ) {}

  ngOnInit(): void {
    this.query = {
      ...this.query,
      user_following_id: this.type === 'follower' ? this.data?.id : '',
      user_id: this.type === 'following' ? this.data?.id : '',
      organization_id:
        this.resource_type === 'organization' ? this.data?.id : '',
      resource_type: this.resource_type,
    };
    this.getFollowsData(this.query);
  }

  actionRedirect(user: UserDetail) {
    this.ctrl.dismiss();
    this.router.navigate(['/tabs', 'users', user.id]);
  }

  getFollowsData(query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
    user_following_id?: string;
    user_id?: string;
    organization_id?: string;
  }) {
    this.isLoading = true;
    if (this.resource_type === 'user') {
      if (this.type === 'follower') {
        query.include = this.type === 'follower' ? 'user' : 'user_following';
        this.followService.getListUserFollowers(query).subscribe((res) => {
          if (res && res.data) {
            this.userFollows = res.data;
            this.query.limit = +res.paging.limit;
            this.query.offset = +res.paging.limit;
            this.countFollows = +res.paging.count;
            this.isLoading = false;
          }
        });
      } else {
        query.include = this.type === 'follower' ? 'user' : 'user_following';
        this.followService.getListUserFollowings(query).subscribe((res) => {
          if (res && res.data) {
            this.userFollows = res.data;
            this.query.limit = +res.paging.limit;
            this.query.offset = +res.paging.limit;
            this.countFollows = +res.paging.count;
            this.isLoading = false;
          }
        });
      }
    } else {
      query.include = 'user';
      this.followService
        .getListUserFollowersOrganization(query)
        .subscribe((res) => {
          if (res && res.data) {
            this.userFollows = res.data;
            this.query.limit = +res.paging.limit;
            this.query.offset = +res.paging.limit;
            this.countFollows = +res.paging.count;
            this.isLoading = false;
          }
        });
    }
  }

  //get data for load scroll
  getLoadFollowsData(query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
    resource_type?: string;
  }) {
    this.followService.getListUserFollowers(query).subscribe((res: any) => {
      if (res && res.data) {
        this.userFollows = this.userFollows.concat(res.data);
        this.query.offset = this.userFollows.length;
        this.countFollows = +res.paging.count;
      }
    });
  }

  //load data after scroll
  loadDataFollows() {
    let query: any = {
      ...this.query,
      offset: this.query.offset,
      limit: this.query.limit,
    };
    if (this.query.offset < this.countFollows) {
      this.getLoadFollowsData(query);
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    this.loadDataFollows();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  getImageSrc(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  setCloseModal(value: boolean) {
    this.setOpen.emit(value);
  }

  changeSegment(event: any) {
    this.type = event.detail.value;
    event.detail.value === 'follower'
      ? (this.query = {
          ...this.query,
          user_following_id: this.data?.id,
          user_id: '',
          offset: 0,
        })
      : (this.query = {
          ...this.query,
          user_id: this.data?.id,
          user_following_id: '',
          offset: 0,
        });

    this.getFollowsData(this.query);
  }

  selectFollowList(value: string) {
    this.selectList = value;
  }
}
