import { LocationStrategy } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FriendService, UserService } from '../../services';
import { UserDetail } from '../../interface/user.interface';
import * as _ from 'lodash';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  name: string = '';

  // users: UserDetail[] = [];
  selectedUsers: UserDetail[] = [];

  userIds: string[] = [];

  isNameForcus = false;

  isLoading: boolean = true;
  updateAvatar: boolean = true;
  isAvatar: boolean = true;
  isUploadImage: boolean = false;
  imagesString: string = '';
  showZoomAvatar: boolean = false;
  user!: { id: string };

  users: any = [];

  limit = 10;
  offset = 0;
  count = 0;
  param: any;

  constructor(
    private location: LocationStrategy,
    private userService: UserService,
    private friendService: FriendService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      throwError('User data not found in localStorage.');
    }

    this.friendService
      .getListFriends(this.user.id, this.param)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.users = res.data;
          this.limit = +res.paging.limit;
          this.offset = +res.paging.limit;
          this.count = +res.paging.count;
          this.isLoading = false;
        }
      });
  }

  back() {
    this.location.back();
  }

  nameForcus() {
    this.isNameForcus = true;
  }

  nameBlur() {
    this.isNameForcus = false;
  }

  getSelectedUserIds(userIds: string[]) {
    this.selectedUsers = _.filter(this.users, (user) =>
      _.includes(userIds, user.id)
    );
  }

  userRemoved(userId: string) {
    this.selectedUsers = _.filter(
      this.selectedUsers,
      (user) => user.id != userId
    );
  }

  async setCoverImage(event: any) {
    this.isUploadImage = true;
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }
  }

  getSrcImage(thumbnail: string) {
    this.showZoomAvatar = true;
    this.imagesString = thumbnail;
  }

  closeZoom(value: boolean) {
    this.showZoomAvatar = value;
    this.imagesString = '';
  }
}
