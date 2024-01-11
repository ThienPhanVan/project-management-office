import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  AlertController,
  InfiniteScrollCustomEvent,
  IonContent,
  IonSearchbar,
  ScrollDetail,
} from '@ionic/angular';
import {
  THUMBNAIL_URL,
  convertDataNewsList,
  WELCOME_IMG,
} from '../../constant';
import { NewsData } from '../../interface/news.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { catchError } from 'rxjs';
import {
  NewsDataService,
  NotificationDataService,
} from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';
import { AuthService, UserNotificationService } from 'src/app/services';
import { type } from 'os';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  @ViewChild('fab', { read: ElementRef }) fab!: ElementRef;
  @ViewChild(IonContent) content: IonContent | undefined;
  fabListOpen: boolean = false;

  isLoading: boolean = true;
  data: Omit<NewsData, ''>[] = [];
  isModalCreate = false;
  showModal: boolean = false;
  isClearSearch: boolean = false;

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    type: '',
  };
  disabledSeg: boolean = false;
  me: any;
  hostNameLocation: string = '';
  badge: number = 0;

  categories = [
    { id: '', name: this.translate.instant('TAB.HOME.CHILD.ALL') },
    { id: '0', name: this.translate.instant('TAB.HOME.CHILD.OPPORTUNITY') },
    { id: '1', name: this.translate.instant('TAB.HOME.CHILD.EVENT') },
    { id: '2', name: this.translate.instant('TAB.HOME.CHILD.NEWS') },
  ];

  textWelcome = {
    name: this.translate.instant('TAB.HOME.WELCOME_TO_GCE'),
    image: WELCOME_IMG,
  };

  constructor(
    private route: Router,
    private newsService: NewsService,
    private router: ActivatedRoute,
    private newsDataService: NewsDataService,
    private translate: TranslateService,
    private alertController: AlertController,
    private authService: AuthService,
    private userNotificationService: UserNotificationService,
    private notificationDataService: NotificationDataService
  ) {
    this.subscribeFetchFilter();
    this.subscribeFetchNews();

    this.newsDataService.newsDetail$.subscribe((res) => {
      this.data.forEach((item: any, index: number) => {
        if (item.id === res.id) {
          this.data[index] = res;
        }
      });
    });
    this.notificationDataService.countBadges$.subscribe((res) => {
      this.badge = res;
    });
  }

  buttonNews: any[] = [
    {
      type: '0',
      title: 'TAB.HOME.CHILD.OPPORTUNITY',
      icon: 'bulb-outline',
    },
    {
      type: '1',
      title: 'TAB.HOME.CHILD.EVENT',
      icon: 'calendar-number-outline',
    },
    {
      type: '2',
      title: 'TAB.HOME.CHILD.NEWS',
      icon: 'newspaper-outline',
    },
  ];

  searchValue: any = '';

  ngOnInit(): void {
    // this.searchValue = this.aroute.snapshot.queryParamMap.get('q');
    this.router.queryParams.subscribe((params: any) => {
      this.searchValue =
        params['q']?.replaceAll('%', '') ||
        (params['tag']?.replaceAll('%', '')
          ? `#${params['tag']?.replaceAll('%', '')}`
          : '');
      const queryStr = localStorage.getItem('searchQueryNews');

      if (queryStr) {
        // this.query = JSON.parse(queryStr);

        this.query = {
          ...JSON.parse(queryStr),
          user_id: '',
          q: this.searchValue.replaceAll('%', '')
            ? `%${this.searchValue.replaceAll('%', '')}%`
            : '',
        };
      } else {
        this.isLoading = false;
      }
      const orgIdString = this.router.snapshot.params['orgId'] ?? null;
      const userIdString = this.router.snapshot.params['userId'] ?? null;
      const chapterIdString = this.router.snapshot.params['chapterId'] ?? null;

      if (orgIdString) {
        this.query = {
          ...this.query,
          organization_id: orgIdString,
        };
        this.disabledSeg = true;
      }

      if (userIdString) {
        this.query = {
          ...this.query,
          user_id: userIdString,
        };
        this.disabledSeg = true;
      }

      if (chapterIdString) {
        this.query = {
          ...this.query,
          chapter_id: chapterIdString,
        };
        this.disabledSeg = true;
      }
      this.getMe();

      if (
        this.data.length === 0 ||
        this.data.length === 1 ||
        this.searchValue !== '' ||
        this.isClearSearch
      ) {
        this.getInitData(this.query);
        this.isClearSearch = false;
      } else {
        this.isLoading = false;
      }
      this.getBadgeNotification();
      this.hostNameLocation = window.location.host;
    });

    if (moment().format('L') === '25/12/2023') {
      let noel = localStorage.getItem('noel');
      if (noel) {
        let alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: 'Chúc mọi người giáng sinh vui vẻ 🎁🔔🎄💕',
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                localStorage.removeItem('noel');
              },
            },
          ],
        };
        this.presentAlert(alertDialog);
      }
    } else {
      localStorage.removeItem('noel');
    }
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  //call api get list news
  getInitData(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    type?: number;
    chapter_id?: string;
    user_id?: string;
    organization_id?: string;
  }) {
    this.isLoading = true;
    this.newsDataService.setMyNewsFilter(this.query);
    localStorage.setItem('searchQueryNews', JSON.stringify(query));

    this.newsService
      .getNews(query)
      .pipe(
        catchError((err) => {
          console.log(err);
          return err;
        })
      )
      .subscribe((res: any) => {
        if (res && res.data) {
          const data = convertDataNewsList(res.data);
          this.data = data;
          this.newsDataService.setMyNews(this.data);
          this.limit = +res.paging.limit;
          this.offset = +res.paging.limit;
          this.count = +res.paging.count;
        }
        this.isLoading = false;
      });
  }

  //get data post bided
  onDataPostBided(data: any) {
    this.data.forEach((item: any, index: number) => {
      if (item.id === data.id) {
        this.data[index] = data;
      }
    });
  }

  setScroll: boolean = false;
  //listen job data changes
  subscribeFetchNews() {
    this.newsDataService.myNews$.subscribe((res) => {
      this.data = res;
      this.setScroll = true;
    });
  }

  ngAfterViewChecked() {
    if (this.setScroll) {
      setTimeout(() => {
        this.scrollToTop();
      }, 500);
      this.setScroll = false;
    }
  }

  scrollToTop() {
    if (this.content) this.content.scrollToTop(500);
  }

  //listen job data changes
  subscribeFetchFilter() {
    this.newsDataService.myNewsFilter$.subscribe((res) => {
      this.query = { ...res, ...this.query };
    });
  }

  //change tab
  changeSegment(event: any) {
    if (this.searchValue !== '') {
      this.query = {
        ...this.query,
        type: event.detail.value,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };
    } else {
      this.query = {
        ...this.query,
        type: event.detail.value,
      };
    }

    this.getInitData(this.query);
  }

  //click tab
  onSegment(ev: any) {
    if (ev.target.value === this.query.type) {
      this.subscribeFetchNews();
    }
  }

  //search news
  searchNews(ev: any) {
    this.query = {
      ...this.query,
      q: ev.target.value,
    };
    this.getInitData(this.query);
  }

  // click create news for type
  onClickCreate(type: number) {
    const typeString = type.toString();
    this.query = {
      ...this.query,
      type: typeString,
      user_id: this.me.id,
    };

    localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
    if (this.query.type === '1') {
      this.route.navigate(['/tabs/events/create']);
    } else if (this.query.type === '0') {
      this.route.navigate(['/tabs/opportunities/create']);
    } else this.route.navigate(['/tabs/news/create']);
  }

  toggleFabList() {
    this.fabListOpen = true;
  }

  @HostListener('document:mousewheel', ['$event'])
  closeFabListOnScroll(event: any) {
    if (!this.fab.nativeElement.contains(event.target)) {
      this.fab.nativeElement.close();
      this.fabListOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  closeFabListOnClickOutside(event: any) {
    if (!this.fab.nativeElement.contains(event.target)) {
      this.fab.nativeElement.close();
      this.fabListOpen = false;
    }
  }

  //load data after scroll
  loadData(ev: any) {
    let query: any = { ...this.query, offset: this.offset, limit: this.limit };
    if (this.offset < this.count) {
      this.newsService.getNews(query).subscribe((res: any) => {
        if (res && res.data) {
          this.offset = this.data.length;
          this.count = +res.paging.count;
          const data = convertDataNewsList(res.data);
          this.data = this.data.concat(data);
        }
        setTimeout(() => {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }, 500);
      });
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    this.loadData(ev);
  }

  setWillParticipate(object: { id: string; type: string }) {
    const body = {
      news_id: object.id,
    };
    if (object.type === 'join') {
      this.newsService.postParticipates(body).subscribe((res) => {
        if (res) {
          this.data.forEach((item: any) => {
            if (item.id === object.id) {
              if (!item.has_participated) {
                item.summary.number_of_participates += 1;
              } else {
                if (item.summary.number_of_participates === 0) {
                  item.summary.number_of_participates = 0;
                } else {
                  item.summary.number_of_participates -= 1;
                }
              }
              item.has_participated = !item.has_participated;
            }
          });
          // this.getInitData(this.query);
        }
      });
    } else {
      this.newsService.deleteParticipates(object.id).subscribe((res) => {
        // if (res) {
        this.data.forEach((item: any) => {
          if (item.id === object.id) {
            if (!item.has_participated) {
              item.summary.number_of_participates += 1;
            } else {
              item.summary.number_of_participates -= 1;
            }
            item.has_participated = !item.has_participated;
          }
        });
        // this.getInitData(this.query);
        // }
      });
    }
  }

  //click Heart
  clickHeart(id: string, type: string) {
    const body = {
      resource_id: id,
      react_emoji: 'heart',
      resource_type: type,
    };
    this.newsService.postReaction(body).subscribe((res) => {
      if (res) {
        this.data.forEach((item: any) => {
          if (item.id === id) {
            if (!item.has_reacted) {
              item.summary.number_of_reactions += 1;
            } else {
              if (item.summary.number_of_reactions > 0)
                item.summary.number_of_reactions -= 1;
            }
            item.has_reacted = !item.has_reacted;
          }
        });
      }
    });
  }

  //search tag
  onSearchTag(value: any) {
    const params = {
      q: value.name,
    };
    localStorage.setItem('hashtag', JSON.stringify(params));
    this.route.navigate(['/tabs/news/hashtag']);
  }
  hiddenId: string = '';
  isHidden: boolean = false;

  //hide news
  onHidden(data: any) {
    const body = {
      resource_id: data.id,
      resource_type: 'news',
    };
    this.newsService.postHidden(body).subscribe((res: any) => {
      this.data.forEach((el: any) => {
        if (el.id === res.resource_id) {
          el.hidden = true;
          el.hidden_id = res.id;
        }
      });
    });
  }

  onUndo(id: string) {
    this.newsService.deleteHidden(id).subscribe(() => {
      this.data.forEach((el: any) => {
        if (el.hidden_id === id) {
          el.hidden = false;
          el.hidden_id = undefined;
        }
      });
    });
  }
  isModalUpload: boolean = false;
  uploadData: any;
  isUploadSuccess: boolean = false;
  isLoadingUpload: boolean = true;
  isShowReport: boolean = false;
  idDataWithReport: string = '';
  //action sheet
  onActionSheet(value: {
    event: string;
    data: any;
    type: 'events' | 'news' | 'opportunities';
  }) {
    if (value.event === 'report') {
      this.idDataWithReport = value.data.id;
      this.isShowReport = true;
    } else if (value.event === 'follow') {
      const body = {
        resource_id: value.data.id,
        resource_type: 'news',
      };
      this.newsService.postFollowing(body).subscribe((res) => {
        let alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.FOLLOW_FAILURE'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {},
            },
          ],
        };
        if (res) {
          alertDialog.message = this.translate.instant(
            'NOTIFICATION.CONTENT.FOLLOW_SUCCESS'
          );
        }

        this.presentAlert(alertDialog);
      });
    } else if (value.event === 'create') {
      this.route.navigate([`tabs/events/create-children`]);
      localStorage.setItem('event-parent', JSON.stringify(value.data));
    } else if (value.event === 'edit') {
      if (value.type === 'events') {
        this.route.navigate([`tabs/events/update/${value.data.id}`]);
      } else if (value.type === 'opportunities') {
        this.route.navigate([`tabs/opportunities/update/${value.data.id}`]);
      } else this.route.navigate([`/tabs/news/update/${value.data.id}`]);
    } else if (value.event === 'upload') {
      this.uploadData = value.data;
      this.isModalUpload = true;

      // alert('Chức năng upload');
    } else if (value.event === 'delete') {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.newsService.deleteNews(value.data.id).subscribe((res) => {
                let alertDialog = {
                  header: this.translate.instant('NOTIFICATION.HEADER'),
                  message: this.translate.instant(
                    'NOTIFICATION.CONTENT.DELETE_SUCCESS'
                  ),
                  buttons: [
                    {
                      text: this.translate.instant('BUTTON.OK'),
                      role: 'confirm',
                      handler: () => {
                        this.data = this.data.filter(
                          (item: any) => item.id !== value.data.id
                        );
                        // this.getInitData(this.query);
                      },
                    },
                  ],
                };
                this.presentAlert(alertDialog);
              });
            },
          },
          {
            text: this.translate.instant('BUTTON.CANCEL'),
            role: 'cancel',
            handler: () => {},
          },
        ],
      };
      this.presentAlert(alertDialog);
    }
  }

  //report
  onGetValueReport(form: any) {
    const body = {
      parent_id: this.idDataWithReport,
      description: form.description,
    };

    this.newsService.postReport(body).subscribe((res) => {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('NOTIFICATION.CONTENT.REPORT_FAILURE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.isShowReport = false;
            },
          },
        ],
      };
      if (res) {
        this.idDataWithReport = '';
        alertDialog.message = this.translate.instant(
          'NOTIFICATION.CONTENT.REPORT_SUCCESS'
        );
      }

      this.presentAlert(alertDialog);
    });
  }

  //close modal report
  onCloseReport(value: boolean) {
    this.isShowReport = value;
  }
  //remove image in array
  handleRemoveImage(id: string) {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: '',
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {},
        },
      ],
    };
    this.newsService.deleteImages(id).subscribe((res) => {
      if (res) {
        alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.DELETE_SUCCESS'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.getInitData(this.query);
                this.isLoading = false;
                this.isModalUpload = false;
              },
            },
          ],
        };
      } else {
        alertDialog = {
          ...alertDialog,
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.DELETE_FAILURE'
          ),
        };
      }
      this.presentAlert(alertDialog);
    });
  }

  //add image for array
  async handleAddImage(event: any) {
    this.isLoadingUpload = true;
    let dataImages: {
      name: string;
      image_url: string;
      description: string;
      resource_id: string;
      resource_type: string;
    } = {
      name: '',
      image_url: THUMBNAIL_URL,
      description: '',
      resource_id: this.uploadData.id,
      resource_type: 'new',
    };
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    alert(mimeType);
    if (
      mimeType.match(/image\/*/) !== null ||
      mimeType.match(/video\/*/) !== null
    ) {
      await this.newsService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            dataImages = {
              ...dataImages,
              name: res.body.Key,
              image_url: res.body.Location,
              description: res.body.key,
            };

            this.uploadImage(dataImages);
          }
          this.isLoadingUpload = false;
        });
    }
  }

  uploadImage(data: {
    name: string;
    image_url: string;
    description: string;
    resource_id: string;
    resource_type: string;
  }) {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: '',
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {},
        },
      ],
    };

    this.newsService.postImages(data).subscribe((res) => {
      if (res) {
        alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.getInitData(this.query);
                this.isLoading = false;
                this.isModalUpload = false;
              },
            },
          ],
        };
      } else {
        alertDialog = {
          ...alertDialog,
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.UPDATE_FAILURE'
          ),
        };
      }
      this.presentAlert(alertDialog);
    });
  }

  handleCloseUpload(value: boolean) {
    this.isModalUpload = value;
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

  //search
  showSearchNewModel() {
    localStorage.setItem('searchValue', this.searchValue);
    this.route.navigate(['/', 'tabs', 'search']);
  }

  clearSearchNewModel() {
    this.isClearSearch = true;
    this.route.navigate(['/', 'tabs', 'home']);
  }

  getBadgeNotification() {
    this.userNotificationService.numberOfUnread().subscribe((res: any) => {
      if (res) {
        this.badge = res;
      }
    });
  }

  images: {
    index: number;
    data: {
      id: number;
      image_url: string;
    }[];
  } = {
    index: 0,
    data: [],
  };

  //zoom image
  onZoomImage(value: { index: number; data: any }) {
    this.images = {
      index: value.index,
      data: value.data,
    };
    this.showModal = true;
  }

  //close popup preview image
  closeModal(value: boolean) {
    this.showModal = value;
    // this.imagesString = '';
  }
}
