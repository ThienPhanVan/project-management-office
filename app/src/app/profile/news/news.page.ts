import { Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { THUMBNAIL_URL, convertDataNewsList } from '../../constant';
import { NewsData } from '../../interface/news.interface';
import { Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { catchError } from 'rxjs';
import { MasterDataService, NewsDataService } from '../../shared/services';
import { AlertDialog } from 'src/app/interface';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  isLoading: boolean = true;
  data: Omit<NewsData, ''>[] = [];
  isModalCreate = false;
  showModal: boolean = false;

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
    user_id: '',
  };

  countFollow: number = 0;
  queryFollow: any = {
    q: '',
    limit: 10,
    offset: 0,
    include:
      'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    type: '',
    user_id: '',
  };
  me: any;

  constructor(
    private route: Router,
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private masterDataService: MasterDataService,
    private alertController: AlertController,
    private translate: TranslateService,
    private location: Location
  ) {
    this.subscribeFetchFilter();
    this.subscribeFetchNews();
  }

  hostNameLocation: string = '';
  //init
  ngOnInit(): void {
    this.hostNameLocation = window.location.host;
    this.masterDataService.meBus$.subscribe((res: any) => {
      this.me = res;
      if (this.me.id) {
        this.query = {
          ...this.query,
          user_id: this.me.id,
        };
      }
    });
    const queryStr = localStorage.getItem('searchQueryNews');

    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }

    this.getInitData(this.query);
  }

  //call api get list news
  getInitData(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    type?: number;
    user_id?: string;
  }) {
    this.newsDataService.setMyNewsFilter(this.query);
    this.isLoading = true;

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
          this.newsDataService.setMyNews([...this.data]);
          this.limit = +res.paging.limit;
          this.offset = +res.paging.limit;
          this.count = +res.paging.count;
          this.isLoading = false;
        }
      });
  }

  getInitDataFollowing(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    type?: number;
    user_id?: string;
  }) {
    this.isLoading = true;
    this.newsService
      .getNewsFollowing(query)
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
          this.newsDataService.setMyNews([...this.data]);
          this.queryFollow.limit = +res.paging.limit;
          this.queryFollow.offset = +res.paging.limit;
          this.countFollow = +res.paging.count;
          this.isLoading = false;
        }
      });
  }

  //listen job data changes
  subscribeFetchNews() {
    this.newsDataService.myNews$.subscribe((res) => {
      this.data = res;
    });
  }

  //listen job data changes
  subscribeFetchFilter() {
    this.newsDataService.myNewsFilter$.subscribe((res) => {
      this.query = { ...res, ...this.query };
    });
  }
  segmentStatus: number = 0;
  //change tab
  changeSegment(event: any) {
    const value = Number(event.detail.value);
    if (this.segmentStatus !== value) {
      this.segmentStatus = value;

      if (value === 1) {
        this.queryFollow = {
          ...this.queryFollow,
          user_id: this.query.user_id,
          type: this.query.type,
        };
        this.getInitDataFollowing(this.query);
      } else {
        this.getInitData(this.query);
      }
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

  // click create news for type
  onClickCreate(type: number) {
    const url = '/tabs/news/create';
    this.query = {
      ...this.query,
      type: '2',
    };

    localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
    this.route.navigate([url]);
  }

  //get news for load scroll
  getNewsData(query?: {
    offset: number;
    limit: number;
    type: number;
    q?: string;
    includes?: string;
  }) {
    if (this.segmentStatus === 0) {
      this.newsService.getNews(query).subscribe((res: any) => {
        if (res && res.data) {
          this.data = this.data.concat(res.data);
          this.offset = this.data.length;
          this.count = +res.paging.count;
        }
      });
    } else {
      this.newsService.getNewsFollowing(query).subscribe((res: any) => {
        if (res && res.data) {
          this.data = this.data.concat(res.data);
          this.queryFollow.offset = this.data.length;
          this.countFollow = +res.paging.count;
        }
      });
    }
  }

  //load data after scroll
  loadData() {
    if (this.segmentStatus === 0) {
      let query: any = {
        ...this.query,
        offset: this.offset,
        limit: this.limit,
      };
      if (this.offset < this.count) {
        this.getNewsData(query);
      }
    } else {
      let query: any = {
        ...this.queryFollow,
        offset: this.queryFollow.offset,
        limit: this.queryFollow.limit,
      };
      if (this.queryFollow.offset < this.countFollow) {
        this.getNewsData(query);
      }
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    this.loadData();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  setWillParticipate(object: { id: string; type: string }) {
    const body = {
      news_id: object.id,
    };
    if (object.type === 'join') {
      this.newsService.postParticipates(body).subscribe((res) => {
        if (res) {
          this.getInitData(this.query);
        }
      });
    } else {
      this.newsService.deleteParticipates(object.id).subscribe((res) => {
        if (res) {
          this.getInitData(this.query);
        }
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
    this.isLoading = true;
    this.newsService.postReaction(body).subscribe((res) => {
      if (res) {
        this.getInitData(this.query);
      }
    });
  }

  //search tag
  onSearchTag(value: any) {
    const params = {
      q: value.name,
      type: '2',
      user_id: this.query.user_id,
    };
    localStorage.setItem('hashtag', JSON.stringify(params));
    this.route.navigate(['/tabs/news/hashtag']);
  }

  //hide news
  onShowNews(data: any) {
    this.data.forEach((el) => {
      if (el.id === data.data.id) {
        el.isShow = data.value;
      }
    });
  }

  isModalUpload: boolean = false;
  uploadData: any;
  isUploadSuccess: boolean = false;
  isLoadingUpload: boolean = true;
  //action sheet
  onActionSheet(value: {
    event: string;
    data: any;
    type: 'event' | 'news' | 'opportunity';
  }) {
    if (value.event === 'report') {
      alert('Chức năng report');
    } else if (value.event === 'follow') {
      alert('Chức năng follow');
    } else if (value.event === 'create') {
      this.route.navigate([`tabs/events/create-children`]);
      localStorage.setItem('event-parent', JSON.stringify(value.data));
    } else if (value.event === 'edit') {
      if (value.type === 'event') {
        this.route.navigate([`tabs/events/update/${value.data.id}`]);
      } else if (value.type === 'opportunity') {
        this.route.navigate([`tabs/opportunities/update/${value.data.id}`]);
      } else this.route.navigate([`/tabs/news/update/${value.data.id}`]);
    } else if (value.event === 'upload') {
      this.uploadData = value.data;
      this.isModalUpload = true;

      alert('Chức năng upload');
    } else if (value.event === 'delete') {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.newsService.deleteNews(value.data.id).subscribe(() => {
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
                        this.getInitData(this.query);
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
    if (mimeType.match(/image\/*/) !== null) {
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

  goBack() {
    localStorage.removeItem('searchQueryNews');
    this.location.back();
  }
}
