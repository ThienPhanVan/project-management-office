import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AlertDialog, IOrganization } from '../../interface';
import { AlertController } from '@ionic/angular';
import {
  ChapterDataService,
  MasterDataService,
  NewsDataService,
  OrganizationDataService,
} from '../../shared/services';
import * as _ from 'lodash';
import {
  FirebaseNotificationService,
  OrganizationsService,
} from '../../services';
import { IChapter } from '../../interface/chapter.interface';
import { ChapterService } from '../../services/chapter.service';
import { Router } from '@angular/router';
import { THUMBNAIL_URL, convertDataNewsList } from '../../constant';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};
  organizations: IOrganization[] = [];
  chapters: IChapter[] = [];
  isErrorImg: boolean = false;

  isLoading: boolean = true;
  updateAvatar: boolean = true;
  isAvatar: boolean = true;
  isUploadImage: boolean = false;
  imagesString: string = '';
  showModal: boolean = false;

  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private masterDataService: MasterDataService,
    private organizationDataService: OrganizationDataService,
    private organizationsService: OrganizationsService,
    private chapterService: ChapterService,
    private router: Router,
    private chapterDataService: ChapterDataService,
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private firebaseNotificationService: FirebaseNotificationService
  ) {
    this.getMe();
    this.getOrganizations();
    this.getChapters();
  }

  ngOnInit() {}

  setIsUploadImage(value: boolean) {
    return (this.isUploadImage = value);
  }

  getMe() {
    this.masterDataService.meBus$.subscribe((res: any) => {
      this.user = res;
      this.isLoading = false;

      if (!this.user.thumbnail) {
        this.user.thumbnail = THUMBNAIL_URL;
      }

      if (this.user?.id) {
        this.refreshOrganizations();
        this.refreshChapters();
      }
    });
  }

  getOrganizations() {
    this.organizationDataService.myOrganizations$.subscribe((orgs) => {
      this.organizations = orgs;
    });
  }

  refreshOrganizations() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (!_.isNil(user_id)) {
      const query = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,organization_users_user_invited,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((res) => {
        this.organizationDataService.setMyOrganizations(res.data);
      });
    }
  }

  getChapters() {
    this.chapterDataService.myChapters$.subscribe((chapters) => {
      this.chapters = chapters;
    });
  }

  refreshChapters() {
    const query = {
      user_id: this.user.id,
    };
    this.chapterService.getChapters(query).subscribe((res) => {
      this.chapterDataService.setMyChapters(res.data);
    });
  }

  changeOrganization(organizations: any) {
    this.organizations = organizations;
  }

  //update image
  async setCoverImage(event: any) {
    this.setIsUploadImage(true);
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) !== null) {
      await this.userService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            this.user.thumbnail = res.body.Location;
            this.userService.updateUser(this.user, this.user.id).subscribe();
            this.setIsUploadImage(false);
          }
        });
    }
  }

  //alert
  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }

  getSrcImage(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  doSignOut() {
    this.firebaseNotificationService.inactiveToken();

    localStorage.clear();
    this.organizationDataService.setMyOrganizations([{} as IOrganization]);
    this.router.navigate(['/auth/login']);
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
        user_id: this.user.id,
      };
      localStorage.setItem('searchQueryNews', JSON.stringify(query));
      this.getNewsList(query);
      this.router.navigate([`/tabs/profile/news`]);
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
        user_id: this.user.id,
      };
      localStorage.setItem('searchQueryProducts', JSON.stringify(query));
      this.router.navigate([`/tabs/profile/commerce`]);
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
}
