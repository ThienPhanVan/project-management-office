import { Component, Input, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommerceService } from 'src/app/services';
import { convertProductsList } from 'src/app/constant';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';
import { AlertDialog } from 'src/app/interface';

@Component({
  selector: 'chapter-commerce-segment',
  templateUrl: './commerce-segment.component.html',
  styleUrls: ['./commerce-segment.component.scss'],
})
export class CommerceSegmentComponent implements OnInit {
  @Input() chapter: any = {};
  @Input() me: any;
  isLoading: boolean = false;
  products: any;
  limit: number = 10;
  offset: number = 0;
  count: number = 0;
  query: any = {};
  productCategories: any = [];
  isLoadingCategory: boolean = false;
  constructor(
    private router: Router,
    private commerceService: CommerceService,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService,
    private alertController: AlertController
  ) {
    this.subscribeFetchProducts();
    this.subscribeFetchFilter();
  }

  ngOnInit() {
    this.isLoadingCategory = true;
    this.commerceService.getProductCategories().subscribe((res: any) => {
      if (res && res.data) {
        res.data.unshift({
          name: 'All',
        });

        this.productCategories = res.data;
      }
      this.isLoadingCategory = false;
    });

    this.query = {
      chapter_id: this.chapter.id,
      include: 'author,summary,user,product_category,images,organization',
      limit: this.limit,
      offset: this.offset,
    };
    this.getProducts(this.query);
  }

  getProducts(query?: any) {
    this.isLoading = true;
    localStorage.setItem('searchQueryChapterProducts', JSON.stringify(query));
    this.commerceService.getProducts(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.products = data;
        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
      }
    });
    this.isLoading = false;
  }

  //listen job data changes
  subscribeFetchProducts() {
    this.commerceDataService.products$.subscribe((res) => {
      this.products = res;
    });
  }

  //listen job data changes
  subscribeFetchFilter() {
    this.commerceDataService.filter$.subscribe((res) => {
      this.query = { ...res, ...this.query };
    });
  }

  //load data after scroll
  loadData() {
    if (this.offset < this.count && this.query.offset !== this.offset) {
      this.getProductsData(this.query);
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    this.loadData();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  //get news for load scroll
  getProductsData(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    type?: number;
    chapter_id?: string;
    user_id?: string;
    organization_id?: string;
  }) {
    this.commerceService.getProducts(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.products = this.products.concat(data);
        this.offset = this.products.length;
        this.count = +res.paging.count;
      }
    });
  }

  onHeart(id: string) {
    const body = {
      resource_id: id,
      react_emoji: 'heart',
      resource_type: 'product',
    };

    this.commerceService.postReaction(body).subscribe((res) => {
      if (res) {
        this.getProducts(this.query);
      }
    });
  }

  isModalUpload: boolean = false;
  uploadData: any;
  isUploadSuccess: boolean = false;
  isLoadingUpload: boolean = true;
  //action sheet
  onActionSheet(value: { event: string; data: any }) {
    if (value.event === 'report') {
    } else if (value.event === 'follow') {
    } else if (value.event === 'edit') {
      this.router.navigate([`/tabs/commerce/edit/${value.data.id}`]);
    } else if (value.event === 'upload') {
      this.uploadData = value.data;
      this.isModalUpload = true;
    } else if (value.event === 'delete') {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
        buttons: [
          {
            text: this.translate.instant('BUTTON.OK'),
            role: 'confirm',
            handler: () => {
              this.commerceService
                .deleteProducts(value.data.id)
                .subscribe(() => {
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
                          this.getProducts(this.query);
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
    this.commerceService.deleteImages(id).subscribe((res) => {
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
                this.getProducts(this.query);
                this.isLoading = false;
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

  //hide news
  onHidden(data: any) {
    // console.log(data);

    const body = {
      resource_id: data.id,
      resource_type: 'product',
    };
    this.commerceService.postHidden(body).subscribe((res: any) => {
      this.products.forEach((el: any) => {
        if (el.id === res.resource_id) {
          el.hidden = true;
          el.hidden_id = res.id;
        }
      });
    });
  }
  onUndo(id: string) {
    this.commerceService.deleteHidden(id).subscribe(() => {
      this.products.forEach((el: any) => {
        if (el.hidden_id === id) {
          el.hidden = false;
          el.hidden_id = undefined;
        }
      });
    });
  }
}
