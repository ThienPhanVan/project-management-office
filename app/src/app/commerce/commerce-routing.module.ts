import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommercePage } from './commerce.page';

const routes: Routes = [
  {
    path: '',
    component: CommercePage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./commerce/commerce.module').then(
            (m) => m.CommercePageModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchPageModule),
      },
      {
        path: 'user/:id',
        loadChildren: () =>
          import('./commerce/commerce.module').then(
            (m) => m.CommercePageModule
          ),
      },
      {
        path: 'org/:id',
        loadChildren: () =>
          import('./commerce/commerce.module').then(
            (m) => m.CommercePageModule
          ),
      },
      {
        path: 'chapter/:id',
        loadChildren: () =>
          import('./commerce/commerce.module').then(
            (m) => m.CommercePageModule
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./create/create.module').then(
            (m) => m.CreateCommercePageModule
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./create/create.module').then(
            (m) => m.CreateCommercePageModule
          ),
      },

      {
        path: '',
        redirectTo: '/tabs/commerce',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercePageRoutingModule {}
