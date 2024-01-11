import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingAddressRoutingModule } from './shipping-address-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ShippingAddressPage } from './shipping-address.page';

@NgModule({
  declarations: [ShippingAddressPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ShippingAddressRoutingModule,
  ],
})
export class ShippingAddressModule {}
