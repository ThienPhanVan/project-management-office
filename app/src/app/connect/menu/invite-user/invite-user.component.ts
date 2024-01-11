import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FriendService, UserService } from 'src/app/services';
import { UserDetail } from 'src/app/interface/user.interface';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-invite-user-group-connect',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
})
export class InviteUserGroupConnectComponent implements OnInit {
  label: string = '';
  groupId: string = '';
  searchedUsers: UserDetail[] = [];
  users: UserDetail[] = [];
  params: any;
  selectedUserIds: string[] = [];

  isLoading:boolean = true;
  user!: { id: string };
  
  limit = 10;
  offset = 0;
  count = 0;


  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private groupService : GroupService,
    private route : ActivatedRoute,
    private friendService : FriendService,
    private router: Router,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.label = this.translate.instant('PLACEHOLDER.SEARCH');
    const groupId = this.route.snapshot.paramMap.get('groupId');
  
    if (groupId !== null) {
      this.groupId = groupId;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    this.friendService.getListFriends(this.user.id, this.groupId).subscribe((res: any) => {
      if (res && res.data) {
        this.users = res.data
        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
        this.isLoading = false  
      }
    })
  }

  onSearchChange() {
  }

  getSelectedUsers(userIds: string[]){
    this.selectedUserIds = userIds;
  }

  modalDismiss(){
    this.selectedUserIds = [];
  }

  addToGroup(){
    const listUser = this.selectedUserIds
    const data = {
      "user_ids" : listUser
    }
    this.groupService.inviteUserToGroup(this.groupId, data).subscribe(()=> {
     
    }) 
    this.modalController.dismiss()
  }
}
