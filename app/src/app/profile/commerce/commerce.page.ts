import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { AuthService, CommerceService } from '../../services';
import { CommerceDataService } from '../../shared/services/commerce-data.service';
import { THUMBNAIL_URL, convertProductsList } from '../../constant';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.page.html',
  styleUrls: ['./commerce.page.scss'],
})
export class CommercePage implements OnInit {
  buttonCommerces: any[] = [
    {
      title: this.translate.instant('BUTTON.ADD'),
      icon: 'add-circle-outline',
    },
  ];
  data: any = [];
  products: any = [];
  productCategories: any = [];
  newProductCate: any = [];
  segmentStatus: number = 0;
  showModal: boolean = false;
  imagesString: string = '';
  isLoading: boolean = true;
  productCategoryId: string = '';

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

  countFollow: number = 0;
  queryFollow: any = {
    limit: this.limit,
    offset: this.offset,
    include: 'author,summary,user,product_category,images',
    user_id: '',
  };
  me: any;

  constructor(
    private router: Router,
    private commerceService: CommerceService,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService,
    private authService: AuthService,
    private location: Location,
    private alertController: AlertController
  ) {
    this.subscribeFetchProducts();
    this.subscribeFetchFilter();
  }

  ngOnInit() {
    const queryStr = localStorage.getItem('searchQueryProducts');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }

    this.commerceService.getProductCategories().subscribe((res: any) => {
      if (res && res.data) {
        res.data.unshift({
          id: 'all',
          name: 'All',
        });

        this.productCategories = res.data;

        this.isLoading = false;
      }
    });

    this.getMe();
    this.getProducts(this.query);
  }
  //change tab
  changeSegment(event: any) {
    this.segmentStatus = Number(event.detail.value);
    if (this.segmentStatus === 0) {
      this.getProducts(this.query);
    } else {
      this.queryFollow = {
        ...this.queryFollow,
        user_id: this.query.user_id,
      };
      this.getProductsFollowing(this.queryFollow);
    }
  }
  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  getProducts(query?: any) {
    this.isLoading = true;
    localStorage.setItem('searchQueryProducts', JSON.stringify(query));
    this.commerceService.getProducts(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.products = data;
        this.commerceDataService.setProducts(this.products);
        this.limit = +res.paging.limit;
        this.offset = +res.paging.limit;
        this.count = +res.paging.count;
      }
    });
    this.isLoading = false;
  }

  getProductsFollowing(query?: any) {
    this.isLoading = true;
    localStorage.setItem('searchQueryProducts', JSON.stringify(query));
    this.commerceService.getProductsFollowing(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.products = data;
        this.commerceDataService.setProducts(this.products);
        this.queryFollow.limit = +res.paging.limit;
        this.queryFollow.offset = +res.paging.limit;
        this.countFollow = +res.paging.count;
      }
    });
    this.isLoading = false;
  }

  //listen job data changes
  subscribeFetchProducts() {
    this.commerceDataService.products$.subscribe((res) => {
      this.data = res;
    });
  }

  //listen job data changes
  subscribeFetchFilter() {
    this.commerceDataService.filter$.subscribe((res) => {
      this.query = { ...res, ...this.query };
    });
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

  //
  getProductsDataFollow(query?: {
    offset: number;
    limit: number;
    q?: string;
    include?: string;
    type?: number;
    chapter_id?: string;
    user_id?: string;
    organization_id?: string;
  }) {
    this.commerceService.getProductsFollowing(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.queryFollow.products = this.products.concat(data);
        this.queryFollow.offset = this.products.length;
        this.countFollow = +res.paging.count;
      }
    });
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
        this.getProductsData(query);
      }
    } else {
      let query: any = {
        ...this.queryFollow,
        offset: this.queryFollow.offset,
        limit: this.queryFollow.limit,
      };
      if (this.queryFollow.offset < this.countFollow) {
        this.getProductsDataFollow(query);
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

  onClickCreate(type: number) {
    // const typeString = type.toString();
    this.router.navigate(['/tabs/commerce/create']);
  }

  getImageSrc(thumbnail: string) {
    this.showModal = true;
    this.imagesString = thumbnail;
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = '';
  }

  //change category
  onSearchCategories(ev: any) {
    if (ev.target.value === this.productCategoryId) {
      this.subscribeFetchProducts();
    }
  }

  onChangeSegment(ev: any) {
    this.productCategoryId = ev.detail.id;
    let query: any = {
      ...this.query,
      limit: 10,
      offset: 0,
    };
    if (ev.detail.value !== 'all') {
      query = {
        ...query,
        product_category_id: ev.detail.value,
      };
    }

    this.getProducts(query);
  }

  handleSearch(event: any) {
    this.query = {
      ...this.query,
      q: event.target.value.toLowerCase(),
    };

    this.getProducts(this.query);
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

  //hide news
  onShow(data: any) {
    this.data.forEach((el: any) => {
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
      resource_type: 'product',
    };
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) !== null) {
      await this.commerceService
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

    this.commerceService.postImages(data).subscribe((res) => {
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
    localStorage.removeItem('searchQueryProducts');
    this.location.back();
  }
}
