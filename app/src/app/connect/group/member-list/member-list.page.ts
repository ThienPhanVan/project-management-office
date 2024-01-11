import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { UserDetail } from '../../../interface/user.interface';
import { SearchHistoriesService, UserService } from '../../../services';
import { Location } from '@angular/common';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],
})
export class MemberListPage implements OnInit {
  searchedUsers: UserDetail[] = [];
  deletingUserIds: string[] = [];
  users: UserDetail[] = [];
  groupId: string = '';
  memberId: string = '';

  isLoading: boolean = true;
  limit = 10;
  offset = 0;
  count = 0;
  constructor(
    private location: Location,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private searchHistoryService: SearchHistoriesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      if (groupId !== null) {
        this.groupId = groupId;
      }
      this.groupService.getGroupById(this.groupId).subscribe((res) =>{
        // console.log(res)
      })
      this.groupService.getMemberList(this.groupId).subscribe((res) => {
        // console.log(res)
      })
      let query: any = {
        offset: 0,
        limit: 10,
      };
      if (this.users.length === 0) {
        this.getMemberList(query);
      }
    });
  }

  getMemberList(query?: any) {
    this.groupService.getMemberList(this.groupId, query).subscribe((res) => {
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          this.users = [
            ...this.users,
            ...res.data.map((item: { id: any; role : any; user: any }) => ({
              ...item.user,
              memberId: item.id,
              role : item.role
            })),
          ];
          this.offset += this.limit;
          this.count = +res.paging.count;
          this.isLoading = false;
        }
      }
    });
  }

  onDeleteMember(deletedMemberId: string) {
    this.users = this.users.filter((users) => users.id !== deletedMemberId);
  }

  onIonInfinite(ev: any) {
    let query: any = {
      offset: this.offset,
      limit: this.limit,
    };
    this.getMemberList(query);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  changeSegment(event: any) {}

  back() {
    this.location.back();
  }

  histories: any[] = [];

  searchMembers(query: string) {
    let searchQuery: any = {
      offset: 0,
      limit: this.limit,
      search: query,
    };
  
    this.getMemberList(searchQuery);
  }


  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchMembers(query);
  }

  getSearchHistories(query: any = {}) {
    // this.searchHistoryService
    //   .getSearchHistories({ type: 'user', ...query })
    //   .subscribe((res: any) => {
    //     this.histories = res.data;
    //   });
  }

  // handleInput(event: any) {
  //   const query = event.target.value.toLowerCase();
  //   this.getSearchHistories({ q: `%${query}%` });
  // }

  search(event: any) {
    const query = event.target.value.toLowerCase();
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['/', 'tabs', 'users'], {
    //   queryParams: { q: query.replaceAll('%', '') },
    // });
  }

  goBack() {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['/', 'tabs', 'users']);
    this.location.back();
  }

  remove(item: any) {
    // this.histories = this.histories.filter((h: any) => h.id !== item.id);
    // this.searchHistoryService.deleteSearchHistory(item.id).subscribe(() => {});
  }

}
