import { Component, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { THUMBNAIL_URL, convertDataNewsList } from '../../constant';
import {
  IdIndexImageEmit,
  NewsData,
  ZoomImageNews,
} from '../../interface/news.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { catchError } from 'rxjs';
import { NewsDataService } from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';
import { AuthService } from 'src/app/services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-news-by-hashtag',
  templateUrl: './news-by-hashtag.page.html',
  styleUrls: ['./news-by-hashtag.page.scss'],
})
export class NewsByHashtagPage implements OnInit {
  isLoading: boolean = true;
  data: Omit<NewsData, ''>[] = [];
  isModalCreate = false;
  showModal: boolean = false;
  imagesString: string = '';
  showDataImage: ZoomImageNews = {
    index: 0,
    images: [],
  };

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    limit: 10,
    offset: 0,
    include:
      'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    q: '',
  };
  me: any;

  constructor(
    private route: Router,
    private newsService: NewsService,
    private router: ActivatedRoute,
    private newsDataService: NewsDataService,
    private translate: TranslateService,
    private alertController: AlertController,
    private authService: AuthService,
    private location: Location
  ) {
    this.subscribeFetchFilter();
    this.subscribeFetchNews();
  }
  buttonNews: any[] = [
    {
      title: 'TAB.HOME.CHILD.NEWS',
      icon: 'newspaper-outline',
    },
    {
      title: 'TAB.HOME.CHILD.EVENT',
      icon: 'calendar-number-outline',
    },
    {
      title: 'TAB.HOME.CHILD.OPPORTUNITY',
      icon: 'bulb-outline',
    },
  ];

  //init
  ngOnInit(): void {
    // let query = {
    //   limit: 10,
    //   offset: 0,
    //   include:
    //     'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    //   q: '',
    // };
    const hashtagStr = localStorage.getItem('hashtag');
    if (hashtagStr) {
      const convert = JSON.parse(hashtagStr);
      this.query = {
        ...this.query,
        ...convert,
      };
    }
    // console.log(this.query);

    this.getMe();
    this.getInitDataByTag(this.query);
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  //search tag
  onSearchTag(value: any) {
    this.query = {
      ...this.query,
      limit: 10,
      offset: 0,
      q: `${value.name}`,
    };

    this.getInitDataByTag(this.query);
  }

  getInitDataByTag(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    type?: number;
    chapter_id?: string;
    user_id?: string;
    organization_id?: string;
    tag?: string;
  }) {
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
          this.query.limit = +res.paging.limit;
          this.query.offset = +res.paging.limit;
          this.count = +res.paging.count;
          this.isLoading = false;
        }
      });
  }

  //get news for load scroll
  getNewsByTagData(query: any) {
    this.newsService.getNews(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataNewsList(res.data);
        this.data = this.data.concat(data);
        this.query.offset = this.data.length;
        this.count = +res.paging.count;
      }
    });
  }

  //load data after scroll
  loadDataByTag() {
    let query: any = {
      ...this.query,
      offset: this.query.offset,
      limit: this.query.limit,
    };
    if (this.query.offset < this.count) {
      this.getNewsByTagData(query);
    }
  }

  //scroll data
  onIonInfiniteByTag(ev: any) {
    this.loadDataByTag();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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

  // //change tab
  // changeSegment(event: any) {
  //   this.query = {
  //     ...this.query,
  //     type: event.detail.value,
  //   };
  //   this.getInitData(this.query);
  // }

  //search news
  searchNews(ev: any) {
    this.query = {
      ...this.query,
      q: ev.target.value,
    };
    this.getInitDataByTag(this.query);
  }

  //get images if one image
  getImageSrc(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
    this.showDataImage = {
      index: 0,
      images: [],
    };
  }

  //close popup preview image
  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  //show popup preview list image
  showPopupImages(object: IdIndexImageEmit) {
    const findDataWithId = this.data.find((el: any) => el.id === object.id);
    if (findDataWithId) {
      this.imagesString = '';
      this.showModal = true;
      const images: any = [];
      findDataWithId.listImages?.forEach((el) => {
        images.push(el.image_url);
      });
      this.showDataImage = {
        index: object.index,
        images,
      };
    }
  }

  //click create news for type
  onClickCreate(type: string) {
    this.query = {
      ...this.query,
      type,
    };
    if (type === '1') {
      this.route.navigate(['/tabs/events/create']);
    } else if (type === '0') {
      this.route.navigate(['/tabs/opportunities/create']);
    } else this.route.navigate(['/tabs/news/create']);
  }

  // //get news for load scroll
  // getNewsData(query?: {
  //   offset: number;
  //   limit: number;
  //   type: number;
  //   q?: string;
  //   includes?: string;
  // }) {
  //   this.newsService.getNews(query).subscribe((res: any) => {
  //     if (res && res.data) {
  //       this.data = this.data.concat(res.data);
  //       this.offset = this.data.length;
  //       this.count = +res.paging.count;
  //     }
  //   });
  // }

  // //load data after scroll
  // loadData() {
  //   let query: any = { ...this.query, offset: this.offset, limit: this.limit };
  //   if (this.offset < this.count) {
  //     this.getNewsData(query);
  //   }
  // }

  // //scroll data
  // onIonInfinite(ev: any) {
  //   this.loadData();
  //   setTimeout(() => {
  //     (ev as InfiniteScrollCustomEvent).target.complete();
  //   }, 500);
  // }

  setWillParticipate(object: { id: string; type: string }) {
    const body = {
      news_id: object.id,
    };
    if (object.type === 'join') {
      this.newsService.postParticipates(body).subscribe((res) => {
        if (res) {
          this.getInitDataByTag(this.query);
        }
      });
    } else {
      this.newsService.deleteParticipates(object.id).subscribe((res) => {
        if (res) {
          this.getInitDataByTag(this.query);
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
        this.getInitDataByTag(this.query);
      }
    });
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
    // console.log(123, event);

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
      } else this.route.navigate([`/tabs/news/edit/${value.data.id}`]);
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
                        this.getInitDataByTag(this.query);
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
                this.getInitDataByTag(this.query);
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
                this.getInitDataByTag(this.query);
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
    localStorage.removeItem('hashtag');
    this.location.back();
  }
}
