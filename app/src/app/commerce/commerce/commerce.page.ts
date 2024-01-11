import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  InfiniteScrollCustomEvent,
  IonContent,
  MenuController,
} from '@ionic/angular';
import { AuthService, CommerceService } from '../../services';
import { CommerceDataService } from '../../shared/services/commerce-data.service';
import {
  THUMBNAIL_URL,
  convertDataCarItems,
  convertProductsList,
} from '../../constant';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';
import { query } from '@angular/animations';

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.page.html',
  styleUrls: ['./commerce.page.scss'],
})
export class CommercePage implements OnInit {
  @ViewChild(IonContent) content: IonContent | undefined;

  buttonCommerces: any[] = [
    {
      title: this.translate.instant('BUTTON.ADD'),
      icon: 'add-circle-outline',
    },
  ];
  searchValue: any = '';
  products: any = [];
  productCategories: any = [];
  categoriesFilter: any = [];
  newProductCate: any = [];
  segmentStatus: number = 0;
  showModal: boolean = false;
  isLoadingCategory: boolean = false;
  isFilterCategory: boolean = false;
  isLoading: boolean = true;
  isClearSearch: boolean = false;
  productCategoryId: string = '';

  slideIndex: number = 0;

  limit: number = 10;
  offset: number = 0;
  count: number = 0;
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
    include: 'author,summary,user,product_category,images,organization',
  };

  queryCartItem: any = {
    limit: 10,
    offset: 0,
    include: 'product,user,product_category,images',
  };

  queryCategory: any = {
    include: 'user_favorite',
  };
  me: any;
  cartItems: any = [];
  countCartItem: number = 0;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private commerceService: CommerceService,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService,
    private authService: AuthService,
    private alertController: AlertController,
    private menuCtrl: MenuController
  ) {
    this.subscribeFetchProducts();
    // this.subscribeFetchFilter();
    this.subscribeFetchCartItem();
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe((params: any) => {
      this.searchValue = params['q']?.replaceAll('%', '')
        ? `${params['q']?.replaceAll('%', '')}`
        : '';

      this.query.q = this.searchValue.replaceAll('%', '')
        ? `%${this.searchValue.replaceAll('%', '')}%`
        : '';

      this.getProductCategories();
      this.getMe();
      this.getCartItem(this.queryCartItem);
      // this.productCategoryId = 'all';
    });
  }

  openMenu() {
    /**

     * We refer to the menu using an ID
     * because multiple "start" menus exist.
     */
    console.log(' Open the menu by menu-id');

    this.menuCtrl.open('menu');
  }
  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  //get cartItems
  getCartItem(queryCartItem: any) {
    this.commerceService.getCartItems(queryCartItem).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataCarItems(res.data);
        this.cartItems = data;
        this.countCartItem = res.paging.count;
        this.commerceDataService.setCartItems(res.data);
      }
    });
  }

  //get products
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
      this.isLoading = false;
    });
  }

  //get categories
  getProductCategories() {
    this.isLoadingCategory = true;
    this.commerceService
      .getProductCategories(this.queryCategory)
      .subscribe(async (res: any) => {
        if (res) {
          this.categoriesFilter = res;

          this.commerceDataService.setCategories(this.categoriesFilter);
          const data: any = [];
          let count = 0;
          res.forEach((el: any) => {
            if (el.has_user_favorite) {
              data.push(el);
              count++;
            }
          });
          if (count === 0) {
            this.productCategories = [
              {
                id: 'all',
                name: 'All',
              },
              ...res,
            ];
          } else {
            this.productCategories = [
              {
                id: 'all',
                name: 'All',
              },
              ...data,
            ];
          }
        }
        if (
          this.products.length === 0 ||
          this.products.length === 1 ||
          this.searchValue !== '' ||
          this.isClearSearch
        ) {
          this.query = {
            ...this.query,
            product_category_id: _.filter(
              _.map(this.productCategories, 'id'),
              (id) => id !== 'all'
            ).join(','),
          };
          await this.getProducts(this.query);
          this.isClearSearch = false;
        }
        this.isLoadingCategory = false;
      });
  }
  //fetch categories
  // subscribeFetchCategories() {
  //   this.commerceDataService.categories$.subscribe((res: any) => {
  //     this.categoriesFilter = res;
  //     res = res.filter((item: any) => item.checked === true);
  //     res.unshift({
  //       id: 'all',
  //       name: 'All',
  //     });
  //     this.productCategories = res;
  //   });
  // }

  setScroll: boolean = false;
  //listen job data changes
  subscribeFetchProducts() {
    this.commerceDataService.products$.subscribe((res) => {
      this.products = res;
      this.isLoading = false;
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

  // search
  showSearchProductModel() {
    localStorage.setItem('searchValue', this.searchValue);
    this.route.navigate(['/', 'tabs', 'commerces', 'search']);
  }

  //clear key search
  clearSearchNewModel() {
    this.isClearSearch = true;
    this.route.navigate(['/', 'tabs', 'commerces']);
  }

  // fetch cart item
  subscribeFetchCartItem() {
    this.commerceDataService.cartItems$.subscribe((res: any) => {
      const data = convertDataCarItems(res);
      this.cartItems = data;
      this.countCartItem = res.length;
    });
  }

  //listen job data changes
  // subscribeFetchFilter() {
  //   this.commerceDataService.filter$.subscribe((res) => {
  //     this.query = { ...res, ...this.query };
  //   });
  // }

  //load data after scroll
  loadData(ev: any) {
    let query: any = {
      ...this.query,
      offset: this.offset,
      limit: this.limit,
    };

    if (this.offset < this.count) {
      this.commerceService.getProducts(query).subscribe((res: any) => {
        if (res && res.data) {
          this.offset = this.products.length;
          this.count = +res.paging.count;
          const data = convertProductsList(res.data);
          this.products = this.products.concat(data);
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

  onClickCreate(type: number) {
    // const typeString = type.toString();
    this.route.navigate(['/tabs/commerces/create']);
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

  //change category
  onSearchCategories(ev: any) {
    this.isLoadingCategory = false;

    if (ev.target.value === this.productCategoryId) {
      this.subscribeFetchProducts();
    }
  }

  onChangeSegment(ev: any) {
    this.productCategoryId = ev.detail.value;
    let query: any = {
      ...this.query,
      limit: 10,
      offset: 0,
    };

    if (this.searchValue !== '') {
      query = {
        ...query,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };
    }

    if (ev.detail.value !== 'all') {
      query = {
        ...query,
        product_category_id: ev.detail.value,
      };
    } else {
      query = {
        ...query,
        product_category_id: _.filter(
          _.map(this.productCategories, 'id'),
          (id) => id !== 'all'
        ).join(','),
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
  chooseCategory(ev: any) {
    if (ev.detail.value === this.productCategoryId) {
      this.subscribeFetchProducts();
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
        this.products.forEach((item: any) => {
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

  isModalUpload: boolean = false;
  uploadData: any;
  isUploadSuccess: boolean = false;
  isLoadingUpload: boolean = true;

  //action sheet
  onActionSheet(value: { event: string; data: any }) {
    if (value.event === 'report') {
    } else if (value.event === 'follow') {
    } else if (value.event === 'edit') {
      this.route.navigate([`/tabs/commerces/edit/${value.data.id}`]);
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

  //open modal filter category
  openCategoriesFilter(ev: any) {
    this.isFilterCategory = ev;
  }

  //setOpenModal
  setOpenModal(ev: any) {
    this.isFilterCategory = ev;
  }

  //filter category
  onCategoriesFilter(data: any) {
    this.categoriesFilter = data;
    data = data.filter((item: any) => item.has_user_favorite === true);
    this.productCategories = [
      {
        id: 'all',
        name: 'All',
      },
      ...data,
    ];
  }

  //change checked
  changeChecked(ev: any) {
    this.commerceService.updateCheckedCategory(ev).subscribe((res: any) => {
      if (res) {
        this.getProductCategories();
        let query: any = {
          ...this.query,
          limit: 10,
          offset: 0,
        };

        query = {
          ...query,
          product_category_id: _.filter(
            _.map(this.productCategories, 'id'),
            (id) => id !== 'all'
          ).join(','),
        };

        this.getProducts(query);
      }
    });
  }
}
