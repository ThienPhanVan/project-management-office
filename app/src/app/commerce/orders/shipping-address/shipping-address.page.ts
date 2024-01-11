import { Component, OnInit } from '@angular/core';
import { CommerceService } from 'src/app/services';
import { Location } from '@angular/common';
import { MasterDataService } from 'src/app/shared/services';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialog } from 'src/app/interface';
import { AlertController } from '@ionic/angular';
import { CommerceDataService } from 'src/app/shared/services/commerce-data.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.page.html',
  styleUrls: ['./shipping-address.page.scss'],
})
export class ShippingAddressPage implements OnInit {
  data: any = [];
  me: any;
  type: string = '';
  address: any;
  showCreateAddress: boolean = false;

  public actionSheet = [
    {
      text: this.translate.instant('BUTTON.UPDATE'),
      role: 'edit',
      data: {
        action: 'edit',
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

  constructor(
    private commerceService: CommerceService,
    private commerceDataService: CommerceDataService,
    private location: Location,
    private masterDataService: MasterDataService,
    private translate: TranslateService,
    private alertController: AlertController
  ) {
    this.masterDataService.me$.subscribe((res: any) => {
      this.me = res;
    });
  }

  ngOnInit() {
    this.getAddressShipping();
  }

  getAddressShipping() {
    this.commerceService.getAddressShipping().subscribe((res: any) => {
      if (res && res.data) {
        this.data = res.data;
      }
    });
  }

  goBack() {
    this.location.back();
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
    if (this.type === 'create') {
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
                  this.data.forEach((item: any) => {
                    if (item.id === res.id) {
                      item = res;
                    }
                  });
                  this.commerceDataService.setAddressShipping(this.data);
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
          this.showCreateAddress = true;
        }
        this.presentAlert(alertDialog);
      });
    } else if ((this.type = 'update')) {
      this.commerceService
        .updateAddressShipping(body, ev.data.id)
        .subscribe((res: any) => {
          if (res) {
            alertDialog = {
              ...alertDialog,
              message: this.translate.instant(
                'NOTIFICATION.CONTENT.UPDATE_SUCCESS'
              ),
              buttons: [
                {
                  text: this.translate.instant('BUTTON.OK'),
                  role: 'confirm',
                  handler: () => {
                    this.data.forEach((item: any) => {
                      if (item.id === res.id) {
                        item.address = body.address;
                      }
                    });
                    this.commerceDataService.setAddressShipping(this.data);
                    this.showCreateAddress = false;
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
            this.showCreateAddress = true;
          }
          this.presentAlert(alertDialog);
        });
    }
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

  //update address
  updateAddress(ev: any, data: any) {
    if (ev.detail.data.action === 'edit') {
      this.type = 'update';
      this.showCreateAddress = true;
      this.address = data;
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
                .deleteAddressShipping(data.id)
                .subscribe((res) => {
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
                          this.data = this.data.filter(
                            (item: any) => item.id !== data.id
                          );
                          this.commerceDataService.setAddressShipping(
                            this.data
                          );
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
