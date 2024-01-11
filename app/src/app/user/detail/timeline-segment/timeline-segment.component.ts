import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs';
import { convertDataNewsList } from 'src/app/constant';
import { AlertDialog } from 'src/app/interface';
import {
  ZoomImageNews,
  IdIndexImageEmit,
} from 'src/app/interface/news.interface';
import { AuthService } from 'src/app/services';
import { NewsService } from 'src/app/services/news.service';
import { NewsDataService } from 'src/app/shared/services';

@Component({
  selector: 'user-timeline-segment',
  templateUrl: './timeline-segment.component.html',
  styleUrls: ['./timeline-segment.component.scss'],
})
export class TimelineSegmentComponent implements OnInit {
  @Input() user: any = {};

  isLoading: boolean = true;
  data: any[] = [];
  me: any;
  hostNameLocation: string = '';

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
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'user,chapter,organization,reactions,mentions,author,summary,images,participates,bids,tags,children',
    type: '',
  };
  disabledSeg: boolean = false;
  constructor(
    private route: Router,
    private newsService: NewsService,
    private router: ActivatedRoute,
    private newsDataService: NewsDataService,
    private translate: TranslateService,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.subscribeFetchFilter();
    this.subscribeFetchNews();
  }

  //init
  ngOnInit(): void {
    if (this.user.id) {
      this.query = {
        ...this.query,
        user_id: this.user.id,
      };
      this.disabledSeg = true;
    }
    if (this.data.length === 0 || this.data.length === 1) {
      this.getInitData(this.query);
    }
    this.getMe();
    this.hostNameLocation = window.location.host;
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
    user_id?: string;
  }) {
    this.newsDataService.setMyNewsFilter(this.query);
    localStorage.setItem('searchQueryNews', JSON.stringify(query));
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

          this.limit = +res.paging.limit;
          this.offset = +res.paging.limit;
          this.count = +res.paging.count;
          this.isLoading = false;
        }
      });
  }

  //listen job data changes
  subscribeFetchNews() {
    this.newsDataService.myNews$.subscribe((res) => {});
  }

  //listen job data changes
  subscribeFetchFilter() {
    this.newsDataService.myNewsFilter$.subscribe((res) => {
      this.query = { ...res, ...this.query };
    });
  }

  //change tab
  changeSegment(event: any) {
    this.query = {
      ...this.query,
      type: event.detail.value,
    };
    this.getInitData(this.query);
  }

  //search news
  searchNews(ev: any) {
    this.query = {
      ...this.query,
      q: ev.target.value,
    };
    this.getInitData(this.query);
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
      findDataWithId.listImages?.forEach((el: any) => {
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
    const typeString = type.toString();
    this.query = {
      ...this.query,
      type: typeString,
    };
    localStorage.setItem('searchQueryNews', JSON.stringify(this.query));
    if (type === '1') {
      this.route.navigate(['/tabs/events/create']);
    } else if (type === '0') {
      this.route.navigate(['/tabs/opportunities/create']);
    } else this.route.navigate(['/tabs/news/create']);
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
                item.summary.number_of_participates -= 1;
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

  //get data post bided
  onDataPostBided(data: any) {
    this.data.forEach((item: any, index: number) => {
      if (item.id === data.id) {
        this.data[index] = data;
      }
    });
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
  onSearchTag(value: string) {
    this.query = {
      ...this.query,
      q: value,
    };

    this.getInitData(this.query);
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
}
