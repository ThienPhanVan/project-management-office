import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePage } from './create.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePage,
  },
  {
    path: 'shipping-address',
    loadChildren: () =>
      import('../shipping-address/shipping-address.module').then(
        (m) => m.ShippingAddressModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePageRoutingModule {}
