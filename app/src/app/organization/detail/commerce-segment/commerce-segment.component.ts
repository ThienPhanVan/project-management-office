import { Component, Input, OnInit } from '@angular/core';
import { convertDataOrdersList, convertProductsList } from 'src/app/constant';
import { AuthService, CommerceService } from 'src/app/services';
import { Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';
import { catchError } from 'rxjs';

@Component({
  selector: 'profile-commerce-segment',
  templateUrl: './commerce-segment.component.html',
  styleUrls: ['./commerce-segment.component.scss'],
})
export class CommerceSegmentComponent implements OnInit {
  @Input() organization: any = {};
  @Input() me: any;

  data: any = [];
  products: any = [];
  productCategories: any = [];
  orders: any = [];
  newProductCate: any = [];
  segmentStatus: number = 0;
  showModal: boolean = false;
  imagesString: string = '';
  isLoadingCategory: boolean = true;
  isLoading: boolean = true;

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  slideIndex: number = 0;
  query: {
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
    limit: this.limit,
    offset: this.offset,
    include: 'author,summary,user,product_category,images',
  };

  queryOrders: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'items,buyer,items.products,items.product_category,items.images,items.organization,items.user,items.product_variants',
    status: '',
    seller_id: '',
  };

  isIamGroup: boolean = false;

  constructor(
    private router: Router,
    private commerceService: CommerceService,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.subscribeFetchProducts();
    this.subscribeFetchFilter();
  }

  ngOnInit() {
    this.query = {
      ...this.query,
      organization_id: this.organization.id,
    };

    this.getUser();
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

    this.getProducts(this.query);

    this.queryOrders = {
      ...this.queryOrders,
      seller_id: this.organization.id,
    };
    this.getOrders(this.queryOrders);
  }

  getProducts(query?: any) {
    this.isLoading = true;
    localStorage.setItem('searchQueryProducts', JSON.stringify(query));
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

  //get list orders
  getOrders(query: any) {
    this.isLoading = true;

    // this.newsDataService.setMyNewsFilter(this.query);
    localStorage.setItem('searchQueryNews', JSON.stringify(query));
    this.commerceService
      .getOrders(query)
      .pipe(
        catchError((err) => {
          console.log(err);
          return err;
        })
      )
      .subscribe((res: any) => {
        if (res && res.data) {
          const orders = convertDataOrdersList(res.data);
          this.orders = orders;
          // console.log(this.orders);
          this.commerceDataService.setMyOrders(this.orders);
          this.limit = +res.paging.limit;
          this.offset = +res.paging.limit;
          this.count = +res.paging.count;
        }
        this.isLoading = false;
      });
  }

  //get resource access
  getUser() {
    this.isIamGroup = false;
    this.authService.resourceAccess().subscribe((res: any) => {
      if (res) {
        res.organizations.forEach((item: any) => {
          if (item.organization_id === this.organization.id) {
            this.isIamGroup = true;
          }
        });
      }
    });
  }

  //listen job data changes
  subscribeFetchProducts() {
    this.commerceDataService.products$.subscribe((res) => {
      if (res.length === 0) {
        this.getProducts(this.query);
      } else {
        this.products = res;
      }
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
      alert('Chức năng report');
    } else if (value.event === 'follow') {
      alert('Chức năng follow');
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

  //scroll data
  onIonInfinite(ev: any) {
    if (!this.isLoading) {
      this.loadData();
    }
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

  selectedSegment: string = 'products';

  //change segment
  changeSegment(event: any) {
    this.selectedSegment = event.detail.value;
  }

  //get order detail
  getOrderDetail(data: any) {
    localStorage.setItem('org_seller', this.organization.id);
    this.commerceDataService.setMyOrderDetail(data);
    this.router.navigate(['/', 'orders', data.id]);
  }
}
