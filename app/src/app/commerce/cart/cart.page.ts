import { Component, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { CommerceService } from 'src/app/services';
import { TranslateService } from '@ngx-translate/core';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialog } from 'src/app/interface';
import { AlertController } from '@ionic/angular';
import { convertDataCarItems } from 'src/app/constant';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  isBuyNow: boolean = false;
  selectAll: boolean = true;
  isUpdate: boolean = false;

  orderPreviews: any = [];
  itemOrderPreviews: any = [];

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query = {
    limit: 10,
    offset: 0,
    include: 'product,user,product_category,images',
  };
  cartItems: any = [];
  countCartItem: number = 0;
  total: number = 0;
  total_amount: number = 0;
  countOrder: number = 0;

  constructor(
    private location: Location,
    private commerceService: CommerceService,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService,
    private route: Router,
    private router: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.subscribeFetchCartItem();
  }

  ngOnInit() {
    if (this.cartItems.length === 0) {
      this.getCartItems(this.query);
    } else {
      let count = 0;
      this.cartItems.forEach((item: any) => {
        count += item.cartItems.length;
        item.cartItems.forEach((el: any) => {
          this.total += el.amount * el.quantity;
        });
      });
      this.countCartItem = count;
      this.countOrder = count;
    }
  }

  getCartItems(query: any) {
    this.commerceService.getCartItems(query).subscribe((res: any) => {
      if (res && res.data) {
        res.data.forEach((item: any) => {
          this.total += item.amount * item.quantity;
        });
        const data = convertDataCarItems(res.data);
        this.cartItems = data;

        if (this.cartItems.length === 0) {
          this.selectAll = false;
        } else {
          this.selectAll = true;
        }

        this.countCartItem = res.paging.count;
        this.countOrder = res.paging.count;
        this.commerceDataService.setCartItems(res.data);
        // this.query.limit = +res.paging.limit;
        // this.query.offset = +res.paging.limit;
        // this.count = +res.paging.count;
      }
    });
  }

  // fetch cart item
  subscribeFetchCartItem() {
    this.commerceDataService.cartItems$.subscribe((res: any) => {
      const data = convertDataCarItems(res);
      this.cartItems = data;
      if (this.cartItems.length === 0) {
        this.selectAll = false;
      } else {
        this.selectAll = true;
        this.cartItems.forEach((item: any) => {
          item.checked = true;
          item.cartItems.forEach((el: any) => {
            el.product.checked = true;
          });
        });
        this.orderPreviews = this.cartItems.filter(
          (item: any) => item.checked === true
        );
        localStorage.setItem(
          'orderPreviews',
          JSON.stringify(this.orderPreviews)
        );
      }
    });
  }

  goBack() {
    this.location.back();
  }

  //reduce quantity
  reduceQuantity(data: any) {
    if (data.quantity > 1) {
      this.cartItems.forEach((orderPreview: any) => {
        orderPreview.cartItems.forEach((cartItem: any) => {
          if (cartItem.product.id === data.product.id) {
            cartItem.quantity -= 1;

            let body = {
              product_id: data.product.id,
              percent_discount: +data.product.percent_discount,
              quantity: cartItem.quantity,
              price: +data.product.price,
              amount: +data.product.amount,
            };
            this.commerceService
              .updateCartItem(body, cartItem.id)
              .subscribe((res: any) => {
                if (res) {
                  // this.getCartItems(this.query);
                }
              });
          }
        });
      });
      this.total -= data.amount;
    } else {
      return;
    }
  }
  //add quantity
  addQuantity(data: any) {
    this.cartItems.forEach((orderPreview: any) => {
      orderPreview.cartItems.forEach((cartItem: any) => {
        if (cartItem.product.id === data.product.id) {
          cartItem.quantity += 1;

          let body = {
            product_id: data.product.id,
            percent_discount: +data.product.percent_discount,
            quantity: cartItem.quantity,
            price: +data.product.price,
            amount: +data.product.amount,
          };
          this.commerceService
            .updateCartItem(body, cartItem.id)
            .subscribe((res: any) => {
              if (res) {
                // this.getCartItems(this.query);
              }
            });
        }
      });
    });
    this.total += data.amount;
  }

  //checked cartItem
  checkedCardItem(ev: any, data: any) {
    if (ev.target.checked) {
      this.cartItems.forEach((item: any) => {
        if (
          item.user_sell.id === data.user_sell.id &&
          data.organization_sell.id === data.organization_sell.id
        ) {
          item.checked = true;
          item.cartItems.forEach((el: any) => {
            el.product.checked = true;
          });
        }
      });
    } else {
      this.cartItems.forEach((item: any) => {
        if (
          item.user_sell.id === data.user_sell.id &&
          data.organization_sell.id === data.organization_sell.id
        ) {
          item.checked = false;
          item.cartItems.forEach((el: any) => {
            el.product.checked = false;
          });
        }
      });
    }

    let total_amount = 0;
    let countChecked = 0;
    this.cartItems.forEach((item: any) => {
      if (item.checked) {
        countChecked += 1;
      }
      let countProductChecked = 0;
      item.cartItems.forEach((el: any) => {
        if (el.product.checked) {
          countProductChecked += 1;
          total_amount += el.product.amount * el.quantity;
        }
      });
      if (countProductChecked === item.cartItems.length) {
        this.selectAll = true;
        item.checked = true;
      } else {
        this.selectAll = false;
        item.checked = false;
      }
    });
    if (countChecked === this.cartItems.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
    this.total = total_amount;
    this.orderPreviews = this.cartItems.filter(
      (item: any) => item.checked === true
    );
    let count = 0;
    this.orderPreviews.forEach((item: any) => {
      if (item.checked) {
        count += item.cartItems.length;
      } else {
        item.cartItems.forEach((el: any) => {
          if (el.product.checked) {
            count += 1;
          }
        });
      }
    });
    this.countOrder = count;
    localStorage.setItem('orderPreviews', JSON.stringify(this.orderPreviews));
  }

  checkedCardItemProduct(ev: any, data: any) {
    if (ev.target.checked) {
      this.cartItems.forEach((item: any) => {
        item.cartItems.forEach((el: any) => {
          if (el.product.id === data.id) {
            el.product.checked = true;
          }
        });
      });
    } else {
      this.cartItems.forEach((item: any) => {
        item.cartItems.forEach((el: any) => {
          if (el.product.id === data.id) {
            el.product.checked = false;
            item.checked = false;
          }
        });
      });
    }

    let total_amount = 0;
    let countChecked = 0;
    this.cartItems.forEach((item: any) => {
      if (item.checked) {
        countChecked += 1;
      }
      let countProductChecked = 0;
      item.cartItems.forEach((el: any) => {
        if (el.product.checked) {
          countProductChecked += 1;
          total_amount += el.product.amount * el.quantity;
        }
      });
      if (countProductChecked === item.cartItems.length) {
        item.checked = true;
        countChecked += 1;
      } else {
        item.checked = false;
        countChecked -= 1;
      }
    });
    if (countChecked === this.cartItems.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
    this.total = total_amount;
    let orderPreviewsNew: any = [];

    this.cartItems.forEach((item: any) => {
      if (item.checked) {
        orderPreviewsNew.push(item);
      } else {
        const data = item.cartItems.filter(
          (el: any) => el.product.checked === true
        );

        if (data.length !== 0) {
          orderPreviewsNew.push({ ...item, cartItems: data });
        }
      }
    });
    this.orderPreviews = orderPreviewsNew;

    let count = 0;
    this.orderPreviews.forEach((item: any) => {
      if (item.checked) {
        count += item.cartItems.length;
      } else {
        item.cartItems.forEach((el: any) => {
          if (el.product.checked) {
            count += 1;
          }
        });
      }
    });
    this.countOrder = count;
    localStorage.setItem('orderPreviews', JSON.stringify(this.orderPreviews));
  }

  //check all
  checkAll(ev: any) {
    let total_amount = 0;
    if (ev.target.checked) {
      this.cartItems.forEach((item: any) => {
        item.checked = true;
        item.cartItems.forEach((el: any) => {
          el.product.checked = true;
          total_amount += el.product.amount * el.quantity;
        });
        this.total = total_amount;
      });
    } else {
      this.cartItems.forEach((item: any) => {
        item.checked = false;
        item.cartItems.forEach((el: any) => {
          el.product.checked = false;
        });
      });
      this.total = 0;
    }
    this.orderPreviews = this.cartItems.filter(
      (item: any) => item.checked === true
    );
    let count = 0;
    this.orderPreviews.forEach((item: any) => {
      count += item.cartItems.length;
    });
    this.countOrder = count;
    localStorage.setItem('orderPreviews', JSON.stringify(this.orderPreviews));
  }

  //direct order
  directCheckOrder() {
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
    let count = 0;
    let countItem = 0;
    this.orderPreviews.forEach((item: any) => {
      countItem += item.cartItems.length;
      item.cartItems.forEach((el: any) => {
        this.commerceService.getProductDetail(el.product.id).subscribe(
          (res: any) => {
            if (res.price === 0) {
              alertDialog = {
                ...alertDialog,
                message: this.translate.instant(
                  'NOTIFICATION.CONTENT.UPDATE_OR_NOT_FOUND'
                ),
                buttons: [
                  {
                    text: this.translate.instant('BUTTON.OK'),
                    role: 'confirm',
                    handler: () => {
                      return;
                    },
                  },
                ],
              };
              this.presentAlert(alertDialog);
            } else {
              count++;
            }
            if (count === countItem) {
              localStorage.setItem(
                'orderPreviews',
                JSON.stringify(this.orderPreviews)
              );
              this.route.navigate(['/', 'orders', 'create']);
            }
          },
          (error) => {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.UPDATE_OR_NOT_FOUND'
              ),
              buttons: [
                {
                  text: this.translate.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    return;
                  },
                },
              ],
            };
            this.presentAlert(alertDialog);
          }
        );
      });
    });
  }

  //update cart
  updateCart(value: any) {
    this.isUpdate = value;
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
        this.cartItems.forEach((item: any) => {
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
          });
        });
        this.cartItems.forEach((item: any) => {
          item.cartItems.forEach((el: any) => {
            if (el.product.checked) {
              total_amount += el.product.amount * el.quantity;
            }
          });
        });
        this.total = total_amount;
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
    let count = 0;
    this.orderPreviews.forEach((item: any) => {
      count += item.cartItems.length;
    });
    this.countOrder = count;
    localStorage.setItem('orderPreviews', JSON.stringify(this.orderPreviews));
  }

  //delete product
  deleteOneCarItem(data: any) {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE_PRODUCT'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.selectAll = false;
            this.total = 0;
            this.commerceService
              .deleteCartItem(data.id)
              .subscribe((res: any) => {
                if (res) {
                  this.getCartItems(this.query);
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

  //delete cart item
  deleteCarItem() {
    let alertDialog = {
      header: this.translate.instant('NOTIFICATION.HEADER'),
      message: this.translate.instant('NOTIFICATION.QUESTION.DELETE_PRODUCT'),
      buttons: [
        {
          text: this.translate.instant('BUTTON.OK'),
          role: 'confirm',
          handler: () => {
            this.selectAll = false;
            this.total = 0;
            this.cartItems.forEach((orderPreview: any) => {
              if (orderPreview.checked) {
                orderPreview.cartItems.forEach((cartItem: any) => {
                  this.commerceService
                    .deleteCartItem(cartItem.id)
                    .subscribe((res: any) => {
                      if (res) {
                        this.getCartItems(this.query);
                      }
                    });
                });
              }
              orderPreview.cartItems.forEach((cartItem: any) => {
                if (cartItem.product.checked) {
                  this.commerceService
                    .deleteCartItem(cartItem.id)
                    .subscribe((res: any) => {
                      if (res) {
                        this.getCartItems(this.query);
                      }
                    });
                }
              });
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
