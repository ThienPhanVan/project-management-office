import { Component, OnInit } from '@angular/core';
import { OrganizationsService, UserService } from '../../services';
import { ChapterService } from '../../services/chapter.service';
import { Location } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  segmentStatus: string = 'members';
  type: string;
  showAllSegments: boolean = false;

  pagingUser = {
    limit: 10,
    offset: 0,
    count: 0,
  };
  users: any[] = [];

  pagingOrg = {
    limit: 10,
    offset: 0,
    count: 0,
  };
  organizations: any[] = [];

  pagingChapter = {
    limit: 10,
    offset: 0,
    count: 0,
  };
  chapters: any[] = [];

  isLoadingUser: boolean = false;
  isLoadingOrg: boolean = false;
  isLoadingChapter: boolean = false;

  constructor(
    private userService: UserService,
    private organizationService: OrganizationsService,
    private chapterService: ChapterService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.type = this.getType();
    this.typeClassification();
  }

  ngOnInit(): void {}

  typeClassification() {
    if (this.type) {
      this.segmentStatus = this.type;
    } else {
      this.showAllSegments = true;
    }
  }

  changeSegment(event: any) {
    this.segmentStatus = event.detail.value;
  }

  handleSearch(event: any) {
    this.handleGetUsers(event.target.value.toLowerCase());
    this.handleGetOrgs(event.target.value.toLowerCase());
    this.handleGetChapters(event.target.value.toLowerCase());
  }

  handleGetUsers(q: string) {
    this.isLoadingUser = true;
    const query: any = { offset: 0, limit: this.pagingUser.limit, q: `%${q}%` };

    this.userService.getUsers(query).subscribe((res) => {
      this.pagingUser = {
        limit: +res.paging.limit,
        offset: +res.paging.limit,
        count: +res.paging.count,
      };
      this.users = res.data;

      setTimeout(() => {
        this.isLoadingUser = false;
      }, 1500);
    });
  }

  getUsersData(query?: string) {
    this.userService.getUsers(query).subscribe((res) => {
      if (res && res.data) {
        this.users = this.users.concat(res.data);
        this.pagingUser.offset = this.users.length;
        this.pagingUser.count = +res.paging.count;
      }
    });
  }

  handleGetOrgs(q: string) {
    this.isLoadingUser = true;
    const query: any = { offset: 0, limit: this.pagingOrg.limit, q: `%${q}%` };
    this.organizationService.getOrganizations(query).subscribe((res: any) => {
      this.pagingOrg = {
        limit: +res.paging.limit,
        offset: +res.paging.limit,
        count: +res.paging.count,
      };
      this.organizations = res.data;

      setTimeout(() => {
        this.isLoadingOrg = false;
      }, 1500);
    });
  }

  getOrgsData(query?: string) {
    this.organizationService.getOrganizations(query).subscribe((res) => {
      if (res && res.data) {
        this.organizations = this.organizations.concat(res.data);
        this.pagingOrg.offset = this.organizations.length;
        this.pagingOrg.count = +res.paging.count;
      }
    });
  }

  handleGetChapters(q: string) {
    this.isLoadingChapter = true;
    const query: any = {
      offset: 0,
      limit: this.pagingChapter.limit,
      q: `%${q}%`,
    };
    this.chapterService.getChapters(query).subscribe((res: any) => {
      this.pagingChapter = {
        limit: +res.paging.limit,
        offset: +res.paging.limit,
        count: +res.paging.count,
      };
      this.chapters = res.data;

      setTimeout(() => {
        this.isLoadingChapter = false;
      }, 1500);
    });
  }

  getChaptersData(query?: string) {
    this.chapterService.getChapters(query).subscribe((res) => {
      if (res && res.data) {
        this.chapters = this.chapters.concat(res.data);
        this.pagingChapter.offset = this.chapters.length;
        this.pagingChapter.count = +res.paging.count;
      }
    });
  }

  loadData(objectQuery?: string) {
    let query: any = { offset: 0, limit: 10 };
    if (this.segmentStatus === 'members') {
      query = { offset: this.pagingUser.offset, limit: this.pagingUser.limit };
      if (this.pagingUser.offset < this.pagingUser.count) {
        if (objectQuery) {
          query = { ...query, q: objectQuery };
        }
        this.getUsersData(query);
      }
    } else if (this.segmentStatus === 'organizations') {
      query = { offset: this.pagingOrg.offset, limit: this.pagingOrg.limit };
      if (this.pagingOrg.offset < this.pagingOrg.count) {
        if (objectQuery) {
          query = { ...query, q: objectQuery };
        }
        this.getOrgsData(query);
      }
    } else if (this.segmentStatus === 'chapters') {
      query = {
        offset: this.pagingChapter.offset,
        limit: this.pagingChapter.limit,
      };
      if (this.pagingChapter.offset < this.pagingChapter.count) {
        if (objectQuery) {
          query = { ...query, q: objectQuery };
        }
        this.getChaptersData(query);
      }
    }
  }

  onIonInfinite(ev: any) {
    this.loadData();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  goBack() {
    this.location.back();
  }

  getType() {
    return this.route.snapshot.paramMap.get('type')?.toString() || '';
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
