import { Component, OnInit } from '@angular/core';
import {
  COVER_URL,
  THUMBNAIL_URL,
  convertComment,
  convertDataCarItems,
  convertProductDetail,
  convertProductsList,
} from '../../constant';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CommerceService } from '../../services';
import { CommerceDataService } from '../../shared/services/commerce-data.service';
import { AlertDialog, IAttachment } from '../../interface';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  isBackground: boolean = true;
  isLoading: boolean = false;

  data: any = {
    id: '',
    name: '',
    description: '',
    display_order: null,
    color: null,
    code: null,
    created_date: '',
    created_by: '',
    updated_date: '',
    deleted_date: null,
    parent_id: null,
    image: '',
    price: '0',
    location: '',
    type: 0,
    product_category_id: '',
    user_id: null,
    organization_id: null,
    chapter_id: null,
    author_id: null,
    cover: COVER_URL,
  };
  public actionSheetButtons = [
    {
      text: this.translate.instant('BUTTON.UPDATE'),
      role: 'edit',
      data: {
        action: 'edit',
      },
    },
    {
      text: this.translate.instant('BUTTON.UPLOAD_IMAGE'),
      role: 'upload',
      data: {
        action: 'upload',
      },
    },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  public actionSheetSuperAdmin = [
    {
      text: this.translate.instant('BUTTON.REPORT'),
      role: 'report',
      data: {
        action: 'report',
      },
    },

    {
      text: this.translate.instant('BUTTON.FOLLOW'),
      role: 'follow',
      data: {
        action: 'follow',
      },
    },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  showModal: boolean = false;

  itemComment: any = {
    comment: '',
  };
  isSendSuccess: boolean = false;
  offsetCmt: number = 0;
  limitCmt: number = 10;
  countCmt: number = 0;
  queryComment: any = {
    q: '',
    limit: this.limitCmt,
    offset: this.offsetCmt,
    include: 'author,replies,replies_author',
    resource_id: this.router.snapshot.params['id'],
  };
  valueComment: { name: string; id: string } = {
    name: '',
    id: '',
  };

  queryCartItems = {
    limit: this.limitCmt,
    offset: this.offsetCmt,
    include: 'product,user,product_category,images',
  };

  isActionSheetOpen = false;
  query: any;
  me: any;
  cartItems: any = [];
  countCartItem: number = 0;
  total: number = 0;
  isSendMessage: boolean = false;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
  };

  constructor(
    private location: Location,
    private router: ActivatedRoute,
    private route: Router,
    private commerceService: CommerceService,
    private commerceDataService: CommerceDataService,
    private alertController: AlertController,
    private translate: TranslateService,
    private authService: AuthService,
    private groupService: GroupService
  ) {
    // this.subscribeFetchComment();
    this.subscribeFetchCartItem();
    this.subscribeFetchProduct();
  }

  public actionSheetGuests = [
    {
      text: this.translate.instant('BUTTON.REPORT'),
      role: 'report',
      data: {
        action: 'report',
      },
    },
    // {
    //   text: this.translate.instant('BUTTON.FOLLOW'),
    //   role: 'follow',
    //   data: {
    //     action: 'follow',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetOwn = [
    // {
    //   text: this.translate.instant('BUTTON.REPORT'),
    //   role: 'report',
    //   data: {
    //     action: 'report',
    //   },
    // },
    // {
    //   text: this.translate.instant('BUTTON.FOLLOW'),
    //   role: 'follow',
    //   data: {
    //     action: 'follow',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.UPDATE'),
      role: 'edit',
      data: {
        action: 'edit',
      },
    },
    // {
    //   text: this.translate.instant('BUTTON.UPLOAD_IMAGE'),
    //   role: 'upload',
    //   data: {
    //     action: 'upload',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  ngOnInit() {
    const queryStr = localStorage.getItem('searchQueryProducts');
    if (queryStr) {
      this.query = JSON.parse(queryStr);
    }

    if (Object.keys(this.data).length === 0) {
      this.getProduct();
    }

    this.getMe();

    this.getCartItems(this.queryCartItems);
    // this.getInitCommentData(this.queryComment);
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  getProduct() {
    this.isLoading = true;
    this.commerceService
      .getProductDetail(this.router.snapshot.params['id'])
      .subscribe((res: any) => {
        if (res && res.id) {
          const data = convertProductDetail(res);
          this.data = data;
          if (data?.author?.id === this.me?.id) {
            this.isSendMessage = true;
          } else {
            this.isSendMessage = false;
          }

          this.commerceDataService.setProductDetail(this.data);
          this.isLoading = false;
        } else {
          this.route.navigate(['/not-found']);
        }
      });
  }

  subscribeFetchProduct() {
    this.commerceDataService.productDetail$.subscribe((res: any) => {
      if (Object.keys(res).length !== 0) {
        const data = convertProductDetail(res);
        this.data = data;
        this.isLoading = false;
      } else {
        this.data = {};
      }
    });
  }

  getCartItems(query: any) {
    this.commerceService.getCartItems(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertDataCarItems(res.data);
        this.cartItems = data;
        this.countCartItem = res.paging.count;
        this.commerceDataService.setCartItems(res.data);
      }
    });
  }

  subscribeFetchCartItem() {
    this.commerceDataService.cartItems$.subscribe((res: any) => {
      const data = convertDataCarItems(res);
      this.cartItems = data;
      this.countCartItem = res.length;
    });
  }

  subscribeFetchComment() {
    this.commerceDataService.myNewsComments$.subscribe((res: any) => {
      this.comments = res;
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
  onZoom(value: { index: number; data: any }) {
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

  goBack() {
    // this.commerceDataService.setProducts([]);
    this.location.back();
  }

  onHeart(id: string) {
    const body = {
      resource_id: id,
      react_emoji: 'heart',
      resource_type: 'product',
    };

    this.commerceService.postReaction(body).subscribe((res) => {
      if (res) {
        if (this.data.id === id) {
          if (!this.data?.has_reacted) {
            this.data.summary.number_of_reactions += 1;
          } else {
            if (this.data?.summary.number_of_reactions > 0)
              this.data.summary.number_of_reactions -= 1;
          }
          this.data.has_reacted = !this.data.has_reacted;
          this.commerceDataService.setProductDetail(this.data);
        }
      }
    });
  }

  getProducts() {
    let query: any = {
      limit: 10,
      offset: 0,
      include: 'author,summary,user,product_category,images',
    };
    if (this.query?.user_id) {
      query = {
        ...query,
        user_id: this.query?.user_id,
      };
    }

    this.commerceService.getProducts(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertProductsList(res.data);
        this.commerceDataService.setProducts(data);
      }
    });
  }

  isShowReport: boolean = false;
  idDataWithReport: string = '';
  setResult(ev: any) {
    if (ev.detail.data) {
      if (ev.detail.data.action === 'edit') {
        this.route.navigate([
          `/tabs/commerces/edit/${this.router.snapshot.params['id']}`,
        ]);
      } else if (ev.detail.data.action === 'upload') {
        this.isModalUpload = true;
      } else if (ev.detail.data.action === 'delete') {
        let alertDialog = {
          header: this.translate.instant('NOTIFICATION.HEADER'),
          message: this.translate.instant('NOTIFICATION.QUESTION.DELETE'),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.commerceService
                  .deleteProducts(this.router.snapshot.params['id'])
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
                            this.getProducts();

                            this.route.navigate(['/tabs/commerces']);
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
      } else if (ev.detail.data.action === 'report') {
        this.idDataWithReport = ev.detail.data.id;
        this.isShowReport = true;
      }
    }

    this.isActionSheetOpen = false;
  }

  //report
  onGetValueReport(form: any) {
    const body = {
      parent_id: this.idDataWithReport,
      description: form.description,
    };

    this.commerceService.productReport(body).subscribe((res) => {
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

  setOpenActionSheet(value: boolean) {
    this.isActionSheetOpen = value;
  }

  comments: any = [];
  isLoadingComment: boolean = true;

  //get comments
  getInitCommentData(query?: {
    offset: number;
    limit: number;
    resource_id: string;
    q?: string;
  }) {
    this.isLoadingComment = true;
    this.commerceService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertComment(res.data);
        this.comments = data;
        this.commerceDataService.setMyNewsComments(this.comments);
        this.limitCmt = +res.paging.limit;
        this.offsetCmt = +res.paging.limit;
        this.countCmt = +res.paging.count;
        this.isLoadingComment = false;
      }
    });
  }

  getLoadComments(query?: any) {
    this.isLoadingComment = true;
    this.commerceService.getComments(query).subscribe((res: any) => {
      if (res && res.data) {
        const data = convertComment(res.data);
        this.comments = this.comments.concat(data);
        this.offsetCmt = this.comments.length;
        this.countCmt = +res.paging.count;

        this.isLoadingComment = false;
      }
    });
  }

  //load data after scroll
  loadData() {
    if (this.offsetCmt < this.countCmt) {
      this.getLoadComments(this.queryComment);
    }
  }

  //scroll data
  onIonInfinite(ev: any) {
    this.loadData();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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

  newsListImage: any[] = [];
  isLoadingUpload: boolean = false;
  isModalUpload: boolean = false;
  isUploadSuccess: boolean = false;

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
                this.commerceService
                  .getProductDetail(this.router.snapshot.params['id'])
                  .subscribe((res: any) => {
                    const data = convertProductDetail(res);
                    this.data = data;
                    this.commerceDataService.setProductDetail({ ...this.data });
                  });
                this.isUploadSuccess = false;
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
    // const dataImages: any = [];
    // if (object.isCreate) {
    //   this.data.listImages.forEach((el: any, i: number) => {
    //     if (i !== object.index) dataImages.push(el);
    //   });
    //   this.data.listImages = dataImages;
    // } else {
    //   this.data.listImages.forEach((el: any, i: number) => {
    //     if (i !== object.index) dataImages.push(el);
    //   });
    //   this.data.listImages = dataImages;
    // }
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
      resource_id: this.data.id,
      resource_type: 'event',
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
              resource_type: 'product',
            };

            this.uploadImage(dataImages);
          }
          this.isLoadingUpload = false;
        });

      // this.data.listImages = dataImages;
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
                this.commerceService
                  .getProductDetail(this.router.snapshot.params['id'])
                  .subscribe((res: any) => {
                    const data = convertProductDetail(res);
                    this.data = data;
                    this.commerceDataService.setProductDetail({ ...this.data });
                    this.isUploadSuccess = true;
                  });
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
    this.isActionSheetOpen = false;
  }

  repliesData: any;
  commentEdit: any;
  //onRepliesComment
  onRepliesComment(data: any) {
    this.repliesData = data;
  }

  //onRemoveReply
  onRemoveReply(value: boolean) {
    if (value) {
      this.repliesData = undefined;
    }
  }

  //
  onEditComment(data: any) {
    this.commentEdit = data;
  }

  sendComments(event: {
    newMessage: string;
    selectedAttachments: Array<IAttachment>;
  }) {
    let body: any = {
      name: event.newMessage,
      resource_type: 'product',
    };

    if (this.repliesData) {
      body = {
        ...body,
        parent_id: this.repliesData.id,
      };
    } else {
      body = {
        ...body,
        resource_id: this.router.snapshot.params['id'],
      };
    }

    if (this.commentEdit && body.name !== '') {
      if (this.commentEdit?.childrenId) {
        body = {
          ...body,
          id: this.commentEdit.childrenId,
        };
      } else {
        body = {
          ...body,
          id: this.commentEdit.parentId,
        };
      }

      this.commerceService.putComment(body).subscribe((res) => {
        if (res) {
          this.commerceService
            .getProductDetail(this.router.snapshot.params['id'])
            .subscribe((res: any) => {
              if (res) {
                const data = convertProductDetail(res);
                this.data = data;
                this.commerceDataService.setProductDetail(this.data);
              }
            });
          this.getInitCommentData(this.queryComment);
          this.commentEdit = undefined;
        }
      });
    } else {
      this.commerceService.postComment(body).subscribe((res) => {
        if (res) {
          this.commerceService
            .getProductDetail(this.router.snapshot.params['id'])
            .subscribe((res: any) => {
              if (res) {
                const data = convertProductDetail(res);
                this.data = data;
                this.commerceDataService.setProductDetail(this.data);
              }
            });
          this.getInitCommentData(this.queryComment);
          this.repliesData = undefined;
        }
      });
    }
  }

  //delete comment
  onDeleteComment(id: any) {
    this.isLoadingComment = true;
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE_COMMENT'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.commerceService.deleteComment(id).subscribe(() => {
              this.commerceService
                .getProductDetail(this.router.snapshot.params['id'])
                .subscribe((res: any) => {
                  if (res) {
                    const data = convertProductDetail(res);
                    this.data = data;
                    this.commerceDataService.setProductDetail(this.data);
                  }
                });
              this.getInitCommentData(this.queryComment);
              this.isLoadingComment = false;
            });
          },
        },
        {
          text: this.translate.instant('BUTTON.CANCEL'),
          role: 'cancel',
          handler: () => {
            this.isLoadingComment = false;
          },
        },
      ],
    };

    this.presentAlert(alertDialog);
  }

  onError(item: any, field: string) {
    return (item[field] = THUMBNAIL_URL);
  }

  // search
  showSearchProductModel() {
    this.route.navigate(['/', 'tabs', 'commerces', 'search']);
  }
  isClearSearch: boolean = false;
  clearSearchNewModel() {
    this.isClearSearch = true;
    this.route.navigate(['/', 'tabs', 'home']);
  }

  //direct create order
  onDirectCreateOrder() {
    const orderPreviews: any = [
      {
        user_sell: {},
        organization_sell: {},
        cartItems: [],
        checked: true,
        total_order_preview: 0,
      },
    ];

    if (this.data?.organization) {
      orderPreviews[0] = {
        ...orderPreviews[0],
        organization_sell: this.data.organization,
        cartItems: [
          {
            id: '',
            price: this.data.price,
            percent_discount: this.data.percent_discount,
            quantity: 1,
            amount: this.data.amount,
            product_id: this.data.id,
            product: this.data,
          },
        ],
        total_order_preview: this.data.amount,
      };
    } else {
      orderPreviews[0] = {
        ...orderPreviews[0],
        user_sell: this.data.author,
        cartItems: [
          {
            id: '',
            price: this.data.price,
            percent_discount: this.data.percent_discount,
            quantity: 1,
            amount: this.data.amount,
            product_id: this.data.id,
            product: this.data,
            checked: true,
          },
        ],
        total_order_preview: this.data.amount,
      };
    }
    localStorage.setItem('orderPreviews', JSON.stringify(orderPreviews));
    this.route.navigate(['/', 'orders', 'create']);
  }

  //add to cart

  addToCart() {
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

    this.commerceService
      .getProductDetail(this.router.snapshot.params['id'])
      .subscribe(
        (res: any) => {
          if (res) {
            let body = {
              product_id: this.data.id,
              percent_discount: this.data.percent_discount,
              quantity: 1,
              price: this.data.price,
              amount: this.data.amount,
            };

            if (this.cartItems.length !== 0) {
              let isAvailableProduct: number = 0;
              this.cartItems.forEach((item: any) => {
                item.cartItems.forEach((el: any) => {
                  if (el.product.id === this.data.id) {
                    body = {
                      ...body,
                      quantity: el.quantity + 1,
                    };
                    this.commerceService
                      .updateCartItem(body, el.id)
                      .subscribe((res: any) => {
                        if (res) {
                          this.getCartItems(this.queryCartItems);
                        }
                      });
                  } else {
                    isAvailableProduct += 1;
                  }
                });
              });
              if (isAvailableProduct === this.countCartItem) {
                this.commerceService
                  .insertCartItem(body)
                  .subscribe(async (res: any) => {
                    if (res) {
                      await this.getCartItems(this.queryCartItems);
                    }
                    this.countCartItem++;
                  });
              }
            } else {
              if (this.countCartItem === 0) {
                this.commerceService
                  .insertCartItem(body)
                  .subscribe(async (res: any) => {
                    if (res) {
                      await this.getCartItems(this.queryCartItems);
                    }
                    this.countCartItem++;
                  });
              }
            }
          }
        },
        (error) => {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.CREATE_FAILURE'
            ),
          };
        }
      );
  }

  //direct shop
  directShop(ev: any) {
    localStorage.setItem('url', 'cart');
    if (ev?.organization) {
      this.route.navigate(['/tabs', 'organizations', ev?.organization.id]);
    } else {
      this.route.navigate(['/tabs', 'users', ev?.author.id]);
    }
  }

  //direct mess
  async sendMessage(ev: any) {
    const groupData = {
      is_private: 0,
      member_ids: [ev.author.id],
    };

    this.groupService.createGroup(groupData).subscribe((res) => {
      this.route.navigate(['/group', res.id]);
    });
  }

  //copy-link
  onCopy(value: any) {}
}
