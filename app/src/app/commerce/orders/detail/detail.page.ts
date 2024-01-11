import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { AuthService, CommerceService } from 'src/app/services';
import { query } from '@angular/animations';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';
import { convertDataOrderDetail } from 'src/app/constant';
import { error } from 'console';
import { AlertDialog } from 'src/app/interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  searchValue: any = '';
  isClearSearch: boolean = false;
  subtotal: number = 0;
  deliveryFee: number = 0;
  deliveryDiscount: number = 0;
  order: any;
  me: any;

  orgId = localStorage.getItem('org_seller');

  statusOrders = [
    { id: 1, name: 'TAB.COMMERCE.ORDER.CHILD.AWAITING_SHIPMENT' },
    {
      id: 2,
      name: 'TAB.COMMERCE.ORDER.CHILD.SHIPPED',
    },
    {
      id: 3,
      name: 'TAB.COMMERCE.ORDER.CHILD.CANCELED',
    },
    {
      id: 4,
      name: 'TAB.COMMERCE.ORDER.CHILD.DECLINED',
    },
    {
      id: 5,
      name: 'TAB.COMMERCE.ORDER.CHILD.COMPLETED',
    },
  ];

  constructor(
    private location: Location,
    private router: ActivatedRoute,
    private route: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private commerceService: CommerceService,
    private commerceDataService: CommerceDataService,
    private alertController: AlertController
  ) {
    this.subscribeFetchOrder();
  }

  ngOnInit() {
    // if (Object.keys(this.order).length === 0) {
    this.getOrderDetail();

    // }
    this.getMe();
  }

  //get me
  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  //get order detail
  getOrderDetail() {
    this.commerceService
      .getOrderDetail(this.router.snapshot.params['id'])
      .subscribe((res: any) => {
        if (res && res.status) {
          const data = convertDataOrderDetail(res);
          this.order = data;

          let index = 0;
          this.statusOrders.forEach((item: any, i: number) => {
            if (item.name === this.order.status) {
              index = i;
            }
          });

          if (index > 0) {
            if (index === 2) {
              this.statusOrders = this.statusOrders.filter(
                (item: any) => item.id === 3
              );
            } else {
              this.statusOrders = this.statusOrders
                .slice(index, this.statusOrders.length)
                .filter((item: any) => item.id !== 3)
                .filter((item: any) => item.id !== 4);
            }
          } else {
            this.statusOrders = this.statusOrders
              .slice(index, this.statusOrders.length)
              .filter((item: any) => item.id !== 3);
          }

          this.commerceDataService.setMyOrderDetail(this.order);
        } else {
          this.route.navigate(['/not-found']);
        }
      });
  }

  subscribeFetchOrder() {
    this.commerceDataService.myOrderDetail$.subscribe((res: any) => {
      this.order = res;
      let index = 0;
      this.statusOrders.forEach((item: any, i: number) => {
        if (item.name === this.order.status) {
          index = i;
        }
      });
      if (index > 0) {
        if (index === 2) {
          this.statusOrders = this.statusOrders.filter(
            (item: any) => item.id === 3
          );
        } else {
          this.statusOrders = this.statusOrders
            .slice(index, this.statusOrders.length)
            .filter((item: any) => item.id !== 3)
            .filter((item: any) => item.id !== 4);
        }
      } else {
        this.statusOrders = this.statusOrders
          .slice(index, this.statusOrders.length)
          .filter((item: any) => item.id !== 3);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // search
  showSearchProductModel() {
    this.route.navigate(['/', 'tabs', 'commerces', 'search']);
  }

  clearSearchNewModel() {
    this.isClearSearch = true;
    this.route.navigate(['/', 'tabs', 'home']);
  }

  //direct order detail
  directOrderDetail(order: any) {
    this.commerceDataService.setMyOrderDetail(order);
    this.route.navigate(['/', 'orders', order.id]);
  }

  //confirm order
  confirmOrder(ev: any) {
    let status = this.statusOrders.filter(
      (item: any) => item.id === ev.target.value
    );
    let body = {
      status: status[0].name.replace('TAB.COMMERCE.ORDER.CHILD.', ''),
    };
    this.commerceService
      .updateStatusOrder(body, this.order.id)
      .subscribe((res: any) => {
        this.getOrderDetail();
      });
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
    this.commerceDataService.setMyOrdersPreviews(orderPreviews);
    this.route.navigate(['/', 'orders', 'create']);
  }
  cancelOrder(data: any) {
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

            this.commerceService
              .updateStatusOrder(body, data.id)
              .subscribe((res: any) => {
                if (res) {
                  this.order.status = 'TAB.COMMERCE.ORDER.CHILD.CANCELED';
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
