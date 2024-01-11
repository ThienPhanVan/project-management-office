import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';
import { AlertController, IonContent } from '@ionic/angular';
import { CommerceService } from 'src/app/services';
import { catchError } from 'rxjs';
import { THUMBNAIL_URL, convertDataOrdersList } from 'src/app/constant';
import { AlertDialog } from 'src/app/interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild(IonContent) content: IonContent | undefined;

  orders: any = [];
  searchValue: any = '';
  isClearSearch: boolean = false;
  disabledSeg: boolean = false;
  isLoading: boolean = true;
  showModal: boolean = false;

  cartItems: any = [];
  countCartItem: number = 0;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  offset: number = 0;
  limit: number = 10;
  count: number = 0;

  query: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include:
      'items,buyer,items.products,items.product_category,items.images,items.organization,items.user,items.product_variants',
    status: '',
    // seller_id: this.user.id,
    buyer_id: this.user.id,
  };

  queryCartItems: any = {
    limit: 10,
    offset: 0,
    include: 'product,user,product_category,images',
  };

  constructor(
    private location: Location,
    private router: ActivatedRoute,
    private route: Router,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService,
    private commerceService: CommerceService,
    private alertController: AlertController
  ) {
    this.subscribeFetchOrders();
    this.subscribeFetchCartItem();
  }

  ngOnInit() {
    this.getCartItems(this.queryCartItems);
    this.getOrders(this.query);
  }

  //call api get list orders
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
          this.commerceDataService.setMyOrders(this.orders);
          this.limit = +res.paging.limit;
          this.offset = +res.paging.limit;
          this.count = +res.paging.count;
        }
        this.isLoading = false;
      });
  }

  setScroll: boolean = false;
  //listen job data changes
  subscribeFetchOrders() {
    this.commerceDataService.myOrders$.subscribe((res) => {
      this.orders = res;
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

  getCartItems(query: any) {
    this.commerceService.getCartItems(query).subscribe((res: any) => {
      if (res && res.data) {
        this.countCartItem = +res.paging.count;
        this.commerceDataService.setCartItems(res.data);
      }
    });
  }

  // fetch cart item
  subscribeFetchCartItem() {
    this.commerceDataService.cartItems$.subscribe((res: any) => {
      if (res) {
        let count = 0;
        res?.forEach((item: any) => {
          count += item.cartItems.length;
        });
        this.countCartItem = count;
      }
    });
  }

  goBack() {
    this.route.navigate(['/', 'tabs', 'commerces']);
    // this.location.back();
  }

  //direct order detail
  directOrderDetail(order: any) {
    this.commerceDataService.setMyOrderDetail(order);
    this.route.navigate(['/', 'orders', order.id]);
  }

  // search
  showSearchProductModel() {
    this.route.navigate(['/', 'tabs', 'commerces', 'search']);
  }

  clearSearchNewModel() {
    this.isClearSearch = true;
    this.route.navigate(['/', 'tabs', 'home']);
  }

  //click tab
  onSegment(ev: any) {
    if (ev.target.value === this.query.type) {
      this.subscribeFetchOrders();
    }
  }

  //change tab
  changeSegment(event: any) {
    if (this.searchValue !== '') {
      this.query = {
        ...this.query,
        status: event.detail.value,
        q: this.searchValue.replaceAll('%', '')
          ? `%${this.searchValue.replaceAll('%', '')}%`
          : '',
      };
    } else {
      this.query = {
        ...this.query,
        status: event.detail.value,
      };
    }
    console.log(this.query);

    this.getOrders(this.query);
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
  clickZoom(index: number, data: any) {
    this.images = {
      index: index,
      data: data,
    };
    this.showModal = true;
  }
  onError(item: any) {
    if (item?.image_url) return (item.image_url = THUMBNAIL_URL);
    else return THUMBNAIL_URL;
  }

  //repurchase
  repurchase(order: any) {
    const orderPreviews: any = [
      {
        user_sell: {},
        organization_sell: {},
        cartItems: [],
        checked: true,
        total_order_preview: 0,
      },
    ];

    if (order.items[0].product?.organization) {
      orderPreviews[0] = {
        ...orderPreviews[0],
        organization_sell: order.items[0].product.organization,
        cartItems: [
          {
            id: '',
            price: order.items[0].product.price,
            percent_discount: order.items[0].product.percent_discount,
            quantity: 1,
            amount: order.items[0].product.amount,
            product_id: order.items[0].product.id,
            product: order.items[0].product,
          },
        ],
        total_order_preview: order.items[0].product.amount,
      };
    } else {
      orderPreviews[0] = {
        ...orderPreviews[0],
        user_sell: order.items[0].product.author,
        cartItems: [
          {
            id: '',
            price: order.items[0].product.price,
            percent_discount: order.items[0].product.percent_discount,
            quantity: 1,
            amount: order.items[0].product.amount,
            product_id: order.items[0].product.id,
            product: order.items[0].product,
            checked: true,
          },
        ],
        total_order_preview: order.items[0].product.amount,
      };
    }
    localStorage.setItem('orderPreviews', JSON.stringify(orderPreviews));
    this.route.navigate(['/', 'orders', 'create']);
  }

  cancelOrder(order: any) {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.CANCEL_ORDER'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            let body = {
              status: 'CANCELED',
            };
            this.orders.forEach((item: any) => {
              if (item.id === order.id) {
                this.commerceService
                  .updateStatusOrder(body, order.id)
                  .subscribe((res: any) => {
                    if (res) {
                      item.status = 'TAB.COMMERCE.ORDER.CHILD.CANCELED';
                    }
                  });
              }
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
