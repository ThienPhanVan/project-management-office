import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { CommerceService } from 'src/app/services';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';
import { AlertDialog } from 'src/app/interface';
import { AlertController } from '@ionic/angular';
import {
  convertDataCarItems,
  convertDataOrdersList,
  convertProductsList,
} from 'src/app/constant';
import { catchError } from 'rxjs';
import { MasterDataService } from 'src/app/shared/services';

@Component({
  selector: 'app-create-order',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  orderPreviews: any = [];
  me: any;
  type: string = '';

  total_amount: number = 0;

  countProduct: number = 0;

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any = {
    q: '',
    limit: this.limit,
    offset: this.offset,
    include: 'items,customers,users,items.products,items.product_variants',
    status: '',
  };

  queryCartItems = {
    limit: this.limit,
    offset: this.offset,
    include: 'product,user,product_category,images',
  };

  quantityProduct: number = 1;
  isBuyNow: boolean = false;
  subtotal: number = 0;
  deliveryFee: number = 0;
  deliveryDiscount: number = 0;
  address: any;

  payment: string = 'COD';
  deliveryAddress: string = '';
  isDeliveryAddress: boolean = true;
  showCreateAddress: boolean = false;

  constructor(
    private location: Location,
    private router: ActivatedRoute,
    private route: Router,
    private translate: TranslateService,
    private commerceService: CommerceService,
    private commerceDataService: CommerceDataService,
    private alertController: AlertController,
    private masterDataService: MasterDataService
  ) {
    this.masterDataService.me$.subscribe((res: any) => {
      this.me = res;
    });
    this.commerceDataService.addressShipping$.subscribe((res: any) => {
      console.log(res);

      if (res?.length !== 0) {
        this.address = res.data[0];
        this.isDeliveryAddress = false;
      } else {
        this.getAddressShipping();
      }
    });
  }

  ngOnInit() {
    const orders = localStorage.getItem('orderPreviews');
    let count = 0;
    if (orders) {
      const orderPreviewsNew = JSON.parse(orders);

      orderPreviewsNew.forEach((item: any) => {
        item.cartItems.forEach((el: any) => {
          this.subtotal += el.product.amount * el.quantity;
          count++;
        });
      });
      this.total_amount =
        this.subtotal + this.deliveryFee - this.deliveryDiscount;

      this.orderPreviews = orderPreviewsNew;
      this.orderPreviews.forEach((item: any) => {
        item.total_order_preview = 0;
        item.cartItems.forEach((el: any) => {
          item.total_order_preview += el.amount * el.quantity;
        });
      });
      this.countProduct = count;
    }
  }

  goBack() {
    localStorage.removeItem('orderPreviews');
    this.location.back();
  }

  getAddressShipping() {
    this.commerceService.getAddressShipping().subscribe((res: any) => {
      if (res && res.data.length !== 0) {
        this.address = res.data[0];
        this.isDeliveryAddress = false;
      } else {
        this.isDeliveryAddress = true;
        this.address = null;
      }
    });
  }

  //reduce quantity
  reduceQuantity(data: any) {
    if (data.quantity > 1) {
      this.orderPreviews.forEach((orderPreview: any) => {
        orderPreview.total_order_preview = 0;
        orderPreview.cartItems.forEach((cartItem: any) => {
          if (cartItem.product.id === data.product.id) {
            cartItem.quantity -= 1;

            let body = {
              product_id: data.product.id,
              percent_discount: +data.product.percent_discount,
              quantity: cartItem.quantity,
              price: +data.product.price,
              amount:
                data.product.price -
                (data.product.price * data.product.percent_discount) / 100,
            };
            this.commerceService
              .updateCartItem(body, cartItem.id)
              .subscribe((res: any) => {
                if (res) {
                  // this.getCartItems(this.query);
                }
              });
          }
          orderPreview.total_order_preview +=
            cartItem.amount * cartItem.quantity;
        });
      });
      this.total_amount -= data.amount;
    } else {
      return;
    }
  }
  //add quantity
  addQuantity(data: any) {
    this.orderPreviews.forEach((orderPreview: any) => {
      orderPreview.total_order_preview = 0;
      orderPreview.cartItems.forEach((cartItem: any) => {
        if (cartItem.product.id === data.product.id) {
          cartItem.quantity += 1;

          let body = {
            product_id: data.product.id,
            percent_discount: +data.product.percent_discount,
            quantity: cartItem.quantity,
            price: +data.product.price,
            amount:
              data.product.price -
              (data.product.price * data.product.percent_discount) / 100,
          };
          this.commerceService
            .updateCartItem(body, cartItem.id)
            .subscribe((res: any) => {
              if (res) {
                // this.getCartItems(this.query);
              }
            });
        }
        orderPreview.total_order_preview += cartItem.amount * cartItem.quantity;
      });
    });
    this.total_amount += data.amount;
  }

  //change quantity
  onDiscount(ev: any, data: any) {
    if (ev.target.value !== '0') {
      let discount = ev.target.value
        .replace(/[a-zA-Z]/g, '')
        .replace(/,/g, '')
        .replace(/\s/g, '')
        .replace(/^0+/, '');
      const regex = /^\d+$/;
      if (regex.test(discount)) {
        if (+discount > 1000) {
          discount = 1000;
        }
        let total_amount = 0;
        this.orderPreviews.forEach((item: any) => {
          item.total_order_preview = 0;
          item.cartItems.forEach((el: any) => {
            if (el.id === data.id) {
              el.quantity = +discount;
              let body = {
                product_id: data.product.id,
                percent_discount: +data.product.percent_discount,
                quantity: el.quantity,
                price: +data.product.price,
                amount: +data.product.amount,
              };
              this.commerceService
                .updateCartItem(body, el.id)
                .subscribe((res: any) => {
                  if (res) {
                    // this.getCartItems(this.query);
                  }
                });
            }
            item.total_order_preview += el.amount * el.quantity;
            total_amount += el.product.amount * el.quantity;
          });
          this.subtotal = total_amount;
          this.total_amount =
            this.subtotal + this.deliveryFee - this.deliveryDiscount;
        });
      } else {
        if (data.quantity < 1) {
          data.quantity = 1;
        }
      }
    } else {
      if (data.quantity < 1) {
        data.quantity = 1;
      }
    }
  }

  //change payment
  changePayment(ev: any) {
    this.payment = ev.target.value;
  }

  //delivery address
  onDeliveryAddress(ev: any) {
    let body = {
      address: ev.event.target.value,
    };

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
    this.commerceService.createAddressShipping(body).subscribe((res: any) => {
      if (res) {
        alertDialog = {
          ...alertDialog,
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.CREATE_SUCCESS'
          ),
          buttons: [
            {
              text: this.translate.instant('BUTTON.OK'),
              role: 'confirm',
              handler: () => {
                this.address = res;
                this.isDeliveryAddress = false;
                this.showCreateAddress = false;
              },
            },
          ],
        };
      } else {
        alertDialog = {
          ...alertDialog,
          message: this.translate.instant(
            'NOTIFICATION.CONTENT.CREATE_FAILURE'
          ),
        };

        this.isDeliveryAddress = true;
        this.showCreateAddress = true;
      }
      this.presentAlert(alertDialog);
    });
  }

  //create order
  submit() {
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

    let body = {
      total_amount: this.total_amount,
      delivery_address: '',
      items: [],
      status: 'PENDING',
    };

    let count = 0;
    this.orderPreviews.forEach((item: any) => {
      body = {
        ...body,
        total_amount: +item.total_order_preview,
        delivery_address: this.address?.address,
      };
      const items: any = [];

      item.cartItems.forEach((el: any) => {
        items.push({
          product_id: el.product.id,
          percent_discount: +el.product.percent_discount,
          quantity: +el.quantity,
          price: +el.price,
          amount: +el.amount,
        });
      });

      body = {
        ...body,
        items: items,
      };

      this.commerceService.postOrder(body).subscribe((res: any) => {
        if (res) {
          count += 1;
        }
        if (count === this.orderPreviews.length) {
          alertDialog = {
            ...alertDialog,
            message: this.translate.instant(
              'NOTIFICATION.CONTENT.ORDER_SUCCESS'
            ),
            buttons: [
              {
                text: this.translate.instant('BUTTON.OK'),
                role: 'confirm',
                handler: () => {
                  this.commerceDataService.setCartItems([]);
                  this.commerceDataService.setMyOrders([]);
                  localStorage.removeItem('orderPreviews');
                  this.route.navigate(['/', 'orders']);
                },
              },
            ],
          };
          this.presentAlert(alertDialog);
        }
      });
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

  //open create address modal
  setOpenCreateAddress(ev: any) {
    this.showCreateAddress = ev;
  }

  //create address
  createAddress() {
    this.type = 'create';
    this.showCreateAddress = true;
  }
}
