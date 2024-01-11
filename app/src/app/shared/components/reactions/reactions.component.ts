import * as moment from 'moment';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import {
  AlertController,
  InfiniteScrollCustomEvent,
  ToastController,
} from '@ionic/angular';
import { convertDataNewsDetail, convertDataNewsList } from '../../../constant';
import { NewsDataService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss'],
})
export class ReactionsComponent implements OnInit {
  @Input() data: any;
  @Input() type: string = 'news';
  @Input() hasBid: boolean = false;
  @Input() page: any;
  @Input() isHiddenSummary: boolean = false;
  @Input() hostNameLocation: string = '';

  @Output() heart = new EventEmitter();
  @Output() callbackBids = new EventEmitter();
  @Output() redirect = new EventEmitter();
  @Output() practice = new EventEmitter();
  @Output() bidDetail = new EventEmitter();
  @Output() dataPost = new EventEmitter();

  fakeElem: HTMLTextAreaElement | null | undefined;

  user: any;
  isShowListUser: boolean = false;
  userReactions: any[] = [];
  isLoading: boolean = false;
  query: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    resource_id?: string;
  } = {
    limit: 10,
    offset: 0,
    resource_id: '',
    q: '',
  };
  countReactions: number = 0;

  showBid: boolean = false;
  detailBid: any;

  constructor(
    private newsService: NewsService,
    private newsDataService: NewsDataService,
    private toastController: ToastController,
    private translate: TranslateService,
    private alertController: AlertController
  ) {
    this.subscribeFetchBids();
  }

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
    this.query = {
      ...this.query,
      resource_id: this.data?.id,
    };
  }

  convertEventDate(date: string) {
    const year = date.substr(6,4);
    const month = date.substr(3, 2);
    const day = date.substr(0, 2);
    const time = date.substr(11, 5);

   return `${year}-${month}-${day} ${time}`;
  }

  isOutdate() {
    if (this.data.event_date_end) {
      return moment().isAfter(this.convertEventDate(this.data.event_date_end));
    }
    if (this.data.event_date_start) {
      return moment().isAfter(this.convertEventDate(this.data.event_date_start));
    }
    return false;
  }

  onHeart(id: string) {
    this.heart.emit(id);
  }

  setOpen(value: boolean) {
    this.isShowListUser = value;
  }

  onPractice(id: string, type: string) {
    const object = {
      id,
      type,
    };
    this.practice.emit(object);
  }

  onCopy() {
    try {
      const pathName = `${this.hostNameLocation}/${this.data.id}`;
      this.createFakeElement(pathName);
      return document.execCommand('copy');
    } catch (err) {
      return false;
    } finally {
      this.removeFake();
    }
  }

  createFakeElement(text: string) {
    const docElem = document.documentElement!;
    const isRTL = docElem.getAttribute('dir') === 'rtl';

    // Create a fake element to hold the contents to copy
    this.fakeElem = document.createElement('textarea');

    // Prevent zooming on iOS
    this.fakeElem.style.fontSize = '12pt';

    // Reset box model
    this.fakeElem.style.border = '0';
    this.fakeElem.style.padding = '0';
    this.fakeElem.style.margin = '0';

    // Move element out of screen horizontally
    this.fakeElem.style.position = 'absolute';
    this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';

    // Move element to the same position vertically
    const yPosition = window.pageYOffset || docElem.scrollTop;
    this.fakeElem.style.top = yPosition + 'px';

    this.fakeElem.setAttribute('readonly', '');
    this.fakeElem.value = text;

    document.body.appendChild(this.fakeElem);

    this.fakeElem.select();
    this.fakeElem.setSelectionRange(0, this.fakeElem.value.length);
    this.presentToast('top');
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: this.translate.instant('COMMON.COPIED'),
      duration: 1500,
      position: position,
      icon: 'checkmark-circle',
      cssClass: 'toast-custom-class',
      layout: 'baseline',
      mode: 'ios',
    });

    await toast.present();
  }

  removeFake() {
    if (this.fakeElem) {
      document.body.removeChild(this.fakeElem);
      this.fakeElem = null;
    }
  }

  //show modal register bid
  setOpenBid(value: boolean) {
    if (value && this.data.has_bid) {
      const query = {
        limit: 10,
        offset: 0,
        q: '',
        include: 'news,user',
        news_id: this.data.id,
        user_id: this.user.id,
      };
      this.getDefaultBidsData(query);
    } else {
      this.detailBid = undefined;
      this.showBid = value;
    }
  }

  subscribeFetchBids() {
    this.newsDataService.myBids$.subscribe((res) => {
      this.detailBid = res;
    });
  }

  getDefaultBidsData(query: any) {
    this.newsService.getBids(query).subscribe((res: any) => {
      if (res && res.data) {
        this.detailBid = res.data[0];
        this.newsDataService.setMyBids(res.data[0]);
        this.isLoading = false;
        this.showBid = true;
      }
    });
  }

  //submit bid register
  submitBid(values: any) {
    let body = {
      ...values.data,
      news_id: this.data.id,
    };
    if (values.type === 'update') {
      body = {
        ...body,
        id: this.detailBid.id,
      };

      this.newsService.putBids(body).subscribe((res: any) => {
        if (res) {
          let alertDialog = {
            header: this.translate.instant('NOTIFICATION.HEADER'),
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
            ),
            buttons: [
              {
                text: this.translate.instant('BUTTON.OK'),
                role: 'confirm',
                handler: () => {
                  this.bidDetail.emit(res);

                  // this.fetchNewsListData();
                  if (this.detailBid) {
                    this.fetchNewsDetail();
                  }

                  this.showBid = false;
                },
              },
            ],
          };
          this.presentAlert(alertDialog);
        }
      });
    } else {
      this.newsService.postBids(body).subscribe((res: any) => {
        if (res) {
          let alertDialog = {
            header: this.translate.instant('NOTIFICATION.HEADER'),
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
            ),
            buttons: [
              {
                text: this.translate.instant('BUTTON.OK'),
                role: 'confirm',
                handler: () => {
                  // this.fetchNewsListData();
                  this.fetchNewsDetail();
                  if (this.callbackBids) {
                    this.callbackBids.emit();
                  }
                  this.showBid = false;
                },
              },
            ],
          };
          this.presentAlert(alertDialog);
        }
      });
    }
  }

  //remove bid
  removeBid(value: boolean) {
    if (value) {
      this.newsService.deleteBids(this.detailBid.id).subscribe(() => {
        // this.fetchNewsListData();
        this.fetchNewsDetail();
        this.callbackBids.emit();
        this.showBid = false;
      });
    }
  }

  fetchNewsListData() {
    const queryStr = localStorage.getItem('searchQueryNews');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }
    this.newsService.getNews(this.query).subscribe((response: any) => {
      const data = convertDataNewsList(response.data);
      this.newsDataService.setMyNews([...data]);
    });
  }

  fetchNewsDetail() {
    this.newsService.getNew(this.data.id).subscribe((res: any) => {
      if (res) {
        const data = convertDataNewsDetail(res);
        this.data = data;
        this.dataPost.emit(data);
        this.newsDataService.setNewDetail({ ...this.data });
      }
    });
  }

  //
  redirectDetail(id: string) {
    this.redirect.emit(id);
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
