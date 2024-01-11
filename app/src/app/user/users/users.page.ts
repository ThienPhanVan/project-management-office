import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ListUsers } from 'src/app/interface/user.interface';
import { UserService } from 'src/app/services';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: any = [];

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;
  searchValue: any = '';

  constructor(
    private userService: UserService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.route.queryParams.subscribe((params: any) => {
      this.searchValue =
        params['q']?.replaceAll('%', '') ||
        (params['tag']?.replaceAll('%', '')
          ? `#${params['tag']?.replaceAll('%', '')}`
          : '');
      let query: any = {
        offset: 0,
        limit: 10,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };
      if (this.users.length === 0) {
        this.getUsersData(query);
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.searchValue =
        params['q']?.replaceAll('%', '') ||
        (params['tag']?.replaceAll('%', '')
          ? `#${params['tag']?.replaceAll('%', '')}`
          : '');
      let query: any = {
        offset: 0,
        limit: 10,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };

      this.getUsersData(query);
    });
  }

  getUsersData(query?: string) {
    this.userService.getUsers(query).subscribe((res: any) => {
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
    let query: any = { offset: this.offset, limit: this.limit };
    if (this.offset < this.count) {
      // if (phone_query) {
      //   query = { ...query, phone: phone_query };
      // }
      this.userService.getUsers(query).subscribe((res: ListUsers) => {
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
  // search
  showSearchUserModel() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/', 'tabs', 'users', 'search']);
  }

  goBack() {
    this.location.back();
  }

  handleSearch(event: any) {
    const phone_query = event.target.value.toLowerCase();
    this.loadUsers(phone_query);
  }

  showModal: boolean = false;
  imagesString: string = '';
  getImageSrc(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }
}
