import * as moment from 'moment';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetail } from 'src/app/interface/user.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() users: UserDetail[] = [];

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

  constructor(private router: Router) {}

  ngOnInit() {}

  getMemberType(user: any){
    if(user && user.memberships) {
      const membership = _.find(user.memberships, (m) => moment().isBetween(m.from_date, m.to_date));
      if(membership) {
        return membership.member_type === 1 ? 'VIP': 'Member';
      }
    }

    return '';

  }

  actionRedirect(user: UserDetail) {
    if (this.allowRedirect) {
      this.router.navigate(['/tabs', 'users', user.id]);
    }
  }

  selectedUserIds: string[] = [];
  changeCheckbox(event: any, id: string) {
    if (this.selectedUserIds.length === 0) this.selectedUserIds.push(id);
    else {
      if (event.target.checked) {
        if (this.selectedUserIds.filter((el) => el !== id)) {
          this.selectedUserIds.push(id);
        }
      } else {
        this.selectedUserIds = this.selectedUserIds.filter((el) => el !== id);
      }
    }
    this.selectedUserIdsChange.emit(this.selectedUserIds);
  }

  getSrcImage(thumbnail: string) {
    this.getThumbnail.emit(thumbnail);
  }

  userClick(user: UserDetail) {
    this.onUserClick.emit(user);
  }
}
