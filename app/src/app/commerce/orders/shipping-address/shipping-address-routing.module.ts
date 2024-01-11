import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingAddressPage } from './shipping-address.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingAddressPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingAddressRoutingModule {}
