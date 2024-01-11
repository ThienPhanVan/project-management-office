import { Component, OnInit, Input } from '@angular/core';
import { ChapterService } from 'src/app/services/chapter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IAMGroupService, UserService } from 'src/app/services';
import { AlertDialog, IIAMGroup } from 'src/app/interface';
import {
  ChapterDataService,
  NewsDataService,
  ResourceAcessDataService,
} from 'src/app/shared/services';
import { UserChapterService } from 'src/app/services/user-chapter.service';
import * as _ from 'lodash';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { convertDataNewsList, removeVietnameseTones } from 'src/app/constant';
import { NewsService } from 'src/app/services/news.service';
import { query } from '@angular/animations';
import { ListUsers } from 'src/app/interface/user.interface';
import { log } from 'console';

@Component({
  selector: 'chapter-about-segment',
  templateUrl: './about-segment.component.html',
  styleUrls: ['./about-segment.component.scss'],
})
export class AboutSegmentComponent implements OnInit {
  @Input() chapter: any = {};
  @Input() me: any;
  @Input() resourceAccess: any;
  iamGroups: IIAMGroup[] = [];

  selectedUserIds: string[] = [];
  selectedOrganizationIds: string[] = [];

  chapterId: string = '';

  inviteUserChapter: boolean = true;
  organizationDeleting: boolean = false;
  userDeleting: boolean = false;

  showActivity: boolean = false;
  isLoading: boolean = true;

  selectedSegment: string = 'members';
  usersRequest: any = [];
  users: any = [];
  organizations: any = [];

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    offset: this.offset,
    limit: this.limit,
    include: 'organizations,user_organizations',
    q: '',
  };

  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private userChapterService: UserChapterService,
    private iamGroupService: IAMGroupService,
    private resourceAcessDataService: ResourceAcessDataService,
    private chapterDataService: ChapterDataService,
    private alertController: AlertController,
    private location: Location,
    private router: Router,
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private userService: UserService
  ) {
    this.chapterId = this.route.snapshot.params['id'];
    this.getChapterDetail();
    this.getIAMGroups();

    this.refreshChapterDetail();
  }

  ngOnInit() {
    this.getUsersRequested();
    this.getUsersData(this.query);
  }

  getChapterDetail() {
    this.chapterDataService.chapterDetail$.subscribe((chapter) => {
      this.chapter = chapter;
      this.resourceAccess?.chapters.forEach((item: any) => {
        if (item.chapter_id === this.chapter.id) {
          this.chapter.role_admin = item.iam_group.name;
        }
      });
      this.users = this.chapter.users;
      this.organizations = this.chapter.organizations;
      this.isLoading = false;
    });
  }

  //get user
  getUsersData(query?: string) {
    this.userService
      .getUsersChapter(query, this.chapterId)
      .subscribe((res: any) => {
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
    let query: any = { ...this.query, offset: this.offset, limit: this.limit };
    if (this.offset < this.count) {
      this.userService
        .getUsersChapter(query, this.chapterId)
        .subscribe((res: ListUsers) => {
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

  //get user request
  getUsersRequested() {
    this.chapterService.getUsersRequested().subscribe((res: any) => {
      if (res && res.data) {
        let users: any = [];
        res.data.forEach((item: any) => {
          if (item.chapter.id === this.chapterId)
            users.push({ ...item.user, request_id: item.id });
        });
        this.usersRequest = users;
      }
    });
  }

  refreshChapterDetail() {
    this.chapterService.getChapter(this.chapterId).subscribe((res) => {
      this.chapterDataService.setChapterDetail(res);
    });
  }

  getIAMGroups() {
    this.iamGroupService
      .getGroups({ chapter_id: this.chapterId })
      .subscribe((res: any) => {
        const validatedIAMGroups =
          this.resourceAcessDataService.getValidatedIAMGroups(
            this.chapterId || '',
            'chapter',
            res.data
          );
        this.chapterDataService.setIamGroups(validatedIAMGroups);
        this.iamGroups = validatedIAMGroups;
      });
  }

  refreshMyChapters() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (!_.isNil(user_id)) {
      const query = {
        user_id: user_id,
      };
      this.chapterService.getChapters(query).subscribe((res) => {
        this.chapterDataService.setMyChapters(res.data);
      });
    }
  }

  hasPermission(permission: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      this.chapterId || '',
      'chapter'
    );
  }

  getIAMGroup() {
    return this.resourceAcessDataService.getIAMGroup(
      this.chapterId || '',
      'chapter'
    );
  }

  actionDelete(type: string = 'delete_organizations' || 'delete_users') {
    const alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            if (type === 'delete_users') {
              this.deleteUserChapter();
            } else {
              this.deleteOrganizationChapter();
            }
          },
        },
      ],
    };
    this.presentAlert(alertDialog);
  }

  deleteUserChapter() {
    this.userDeleting = true;
    const params = {
      user_ids: this.selectedUserIds,
    };
    this.chapterService
      .deleteUserChapter(this.route.snapshot.params['id'], params)
      .subscribe(
        () => {
          this.userDeleting = false;
          this.selectedUserIds = [];
          this.refreshChapterDetail();
        },
        () => {
          this.userDeleting = false;
        }
      );
  }

  deleteOrganizationChapter() {
    this.organizationDeleting = true;
    const params = {
      organization_ids: this.selectedOrganizationIds,
    };

    this.chapterService
      .deleteOrganizationChapter(this.route.snapshot.params['id'], params)
      .subscribe(
        () => {
          this.organizationDeleting = false;
          this.selectedUserIds = [];
          this.refreshChapterDetail();
        },
        () => {
          this.organizationDeleting = false;
        }
      );
  }

  goBack() {
    this.location.back();
  }

  arrayOrganizationIdChecked(data: string[]) {
    this.selectedOrganizationIds = data;
  }

  arrayUserIdChecked(data: string[]) {
    this.selectedUserIds = data;
  }

  changeUserChapter(user: any): void {
    this.updateUserChapter(user.user_chapter?.iam_group_id || '', user.id);
  }

  updateUserChapter(iamGroupId: string, userId: string) {
    if (this.chapterId) {
      this.userChapterService
        .updateUserChapter(this.chapterId, userId, iamGroupId)
        .subscribe(() => {
          this.refreshMyChapters();
        });
    }
  }

  async canDismiss(role?: string) {
    return role !== 'gesture';
  }

  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
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

  isOpenModalInviteOrganization: boolean = false;
  openModalInviteOrganization(open: boolean = true) {
    this.isOpenModalInviteOrganization = open;
  }

  isOpenModalInviteUser: boolean = false;
  openModalInviteUser(open: boolean = true) {
    this.isOpenModalInviteUser = open;
  }

  redirectNewsUser(value: number) {
    //
    if (value <= 2) {
      let query: any = {
        q: '',
        limit: 10,
        offset: 0,
        include:
          'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
        type: value === 0 ? '0' : value === 1 ? '1' : '2',
        chapter_id: this.chapter.id,
      };
      localStorage.setItem('searchQueryNews', JSON.stringify(query));
      localStorage.setItem('createNewsType', '2');
      this.getNewsList(query);
      this.router.navigate([`/tabs/news/chapter/${this.chapter.id}`]);
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
        chapter_id: this.chapter.id,
      };
      localStorage.setItem('searchQueryProducts', JSON.stringify(query));
      this.router.navigate([`/tabs/commerce/user/${this.chapter.id}`]);
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

  //change segment
  changeSegment(event: any) {
    this.selectedSegment = event.detail.value;
  }

  //search user
  handleSearch(ev: any) {
    const keyword = ev.detail.value.trim();
    this.query = { ...this.query, q: `%${keyword}%` };
    this.getUsersData(this.query);
  }

  //search org
  handleSearchOrg(ev: any) {
    const keyword = removeVietnameseTones(ev.detail.value.toLowerCase());
    this.chapter.organizations = this.organizations;
    if (keyword) {
      this.chapter.organizations = this.organizations?.filter((item: any) =>
        removeVietnameseTones(
          this.translate.instant(item.name).toLowerCase()
        ).includes(keyword)
      );
    }
  }
}
