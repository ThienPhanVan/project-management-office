

import { throwError } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UserService, FriendService } from '../../services';
import { ListUsers, UserDetail } from '../../interface/user.interface';
import * as _ from 'lodash';
import { NavigationExtras, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { ContactActionComponent } from './contact-action/contact-action.component';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  @Input() allowRedirect: boolean = true;
  @Input() isSelectCheckbox: boolean = false;
  @Input() isLoading: boolean = true;

  @Output() selectedUserIdsChange: EventEmitter<string[]> = new EventEmitter();
  @Output() getThumbnail = new EventEmitter<string>();
  @Output() onUserClick: EventEmitter<UserDetail> = new EventEmitter();

  updateAvatar: boolean = false;
  isAvatar: boolean = true;
  isList: boolean = true;
  classNameAvatar: string = 'list';
  selectedUsers: UserDetail[] = [];
  requests: any[] = [];
  user!: { id: string };

  users: any = [];
  blocks : [] = [];
  currentSegment : string = 'users';

  limit = 10;
  offset = 0;
  count = 0;
  param: any;

  constructor(
    private router: Router,
    private location: LocationStrategy,
    private friendService: FriendService,
    private modalCtrl: ModalController,
    private groupService: GroupService,
    private userService : UserService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.getRequest(this.user.id);
      this.getSuggest();
    } else {
      throwError('User data not found in localStorage.');
    }

    this.friendService.getListFriends(this.user.id, this.param).subscribe((res: any) => {
      if (res && res.data) {
        this.users = res.data;
        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
        this.isLoading = false;
      }
    });
  }

  onIonInfinite(ev: any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  getSuggest() {
    if (this.user && this.user.id) {
      this.friendService.getSuggestion().subscribe((res) => {
        this.isLoading = false;
      });
    }
  }

  async presentModal(userSelect: UserDetail) {
    const modal = await this.modalCtrl.create({
      component: ContactActionComponent,
      componentProps: {
        users: userSelect,
      },
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
    });
    await modal.present();
  }

  actionRedirect(user: UserDetail) {
    if (this.allowRedirect) {
      this.router.navigate(['/tabs', 'users', user.id]);
    }
  }

  messAction(userAction: any) {
    const groupData = {
      is_private: 0,
      member_ids: [userAction.id],
    };
    this.groupService.createGroup(groupData).subscribe((res) => {
      const navigationExtras: NavigationExtras = {
        state: { item: res }
      };
      this.router.navigate(['/group', res.id], navigationExtras);
    });
  }

  truncate(description: string | null): string {
    const maxDescriptionLength = 24;
    
    if (!description || description.length <= maxDescriptionLength) {
      return description || '';
    }
    return description.substring(0, maxDescriptionLength) + '...';
  }

  getRequest(id: string) {
    if (this.user && this.user.id) {
      this.friendService.getRequested().subscribe((res) => {
        this.isLoading = false;
        this.requests = res;
      });
    } else {
      throwError('User object or user ID is null or undefined.');
    }
  }

  acceptRequest(id: string) {
    this.friendService.accept(id).subscribe((res) => {
      this.isLoading = false;
      this.requests = this.requests.filter((request) => request.sender.id !== id);
      this.userService.getUser(id).subscribe((res) => {
        this.users.push(res);
      })
    });
  }
  
  rejectRequest(id: string) {
    this.friendService.reject(id).subscribe((res) => {
      this.isLoading = false;
      this.requests = this.requests.filter((request) => request.sender.id !== id);
    });
  }

  onDeleteFriend(userId: string) {
    console.log('onDeleteFriend called with User ID:', userId);
  }

  getSrcImage(thumbnail: string) {
    this.getThumbnail.emit(thumbnail);
  }

  userClick(user: UserDetail) {
    this.onUserClick.emit(user);
  }

  back() {
    this.location.back();
  }

  getSelectedUserIds(userIds: string[]) {
    this.selectedUsers = _.filter(this.users, (user) =>
      _.includes(userIds, user.id)
    );
  }
}
