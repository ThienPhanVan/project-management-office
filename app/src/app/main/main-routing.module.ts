import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      
  {
    path: '',
    loadChildren: () =>
      import('../tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'app-information',
    loadChildren: () =>
      import('../information/app-information.module').then(
        (m) => m.AppInformationPageModule
      ),
  },
  {
    path: 'register-invited/:id',
    loadChildren: () =>
      import('../page/register-invited/register-invited.module').then(
        (m) => m.RegisterInvitedPageModule
      ),
  },
  {
    path: 'support',
    loadChildren: () =>
      import('../support/support.module').then((m) => m.SupportPageModule),
  },
  {
    path: 'terms-policy',
    loadChildren: () =>
      import('../terms-policy/terms-policy.module').then(
        (m) => m.TermsandpolicyPageModule
      ),
  },
  {
    path: 'search/:type',
    loadChildren: () =>
      import('../page/search/search.page.module').then(
        (m) => m.SearchPageModule
      ),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('../page/search/search.page.module').then(
        (m) => m.SearchPageModule
      ),
  },
  {
    path: 'thread/:threadId',
    loadChildren: () =>
      import('../connect/thread/thread.module').then((m) => m.ThreadPageModule),
  },
  {
    path: 'group/:groupId',
    loadChildren: () =>
      import('../connect/group/group.module').then((m) => m.GroupPageModule),
  },
  {
    path: 'advertisements',
    loadChildren: () =>
      import('../advertisement/advertisement.module').then(
        (m) => m.AdvertisementPageModule
      ),
  },

  {
    path: 'organizations/orders',
    loadChildren: () =>
      import('../organization/detail/orders/orders.module').then(
        (m) => m.OrdersPageModule
      ),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../commerce/orders/orders.module').then((m) => m.OrdersPageModule),
  },
  {
    path: 'carts',
    loadChildren: () =>
      import('../commerce/cart/cart.module').then((m) => m.CartPageModule),
  },
  // {
  //   path: 'news/:id',
  //   loadChildren: () =>
  //     import('../news/detail/detail.module').then((m) => m.DetailPageModule),
  // },
  {
    path: 'tabs/news/create',
    loadChildren: () =>
      import('../news/create/create.module').then((m) => m.CreateNewsPageModule),
  },
  {
    path: 'tabs/news/:id',
    loadChildren: () =>
      import('../news/detail/detail.module').then((m) => m.DetailPageModule),
  },

  {
    path: 'tabs/news/update/:id',
    loadChildren: () =>
      import('../news/create/create.module').then((m) => m.CreateNewsPageModule),
  },
  {
    path: 'tabs/events/create-children',
    loadChildren: () =>
      import('../news/event/create/create.module').then(
        (m) => m.CreateEventsPageModule
      ),
  },
  {
    path: 'tabs/events/create',
    loadChildren: () =>
      import('../news/event/create/create.module').then(
        (m) => m.CreateEventsPageModule
      ),
  },
  {
    path: 'tabs/events/update/:id',
    loadChildren: () =>
      import('../news/event/create/create.module').then(
        (m) => m.CreateEventsPageModule
      ),
  },

  {
    path: 'tabs/opportunities/create',
    loadChildren: () =>
      import('../news/opportunity/create/create.module').then(
        (m) => m.CreateOpportunityPageModule
      ),
  },
  {
    path: 'tabs/opportunities/:id',
    loadChildren: () =>
      import('../news/opportunity/detail/detail.module').then(
        (m) => m.OpportunityDetailComponentModule
      ),
  },
  {
    path: 'tabs/opportunities/update/:id',
    loadChildren: () =>
      import('../news/opportunity/create/create.module').then(
        (m) => m.CreateOpportunityPageModule
      ),
  },

  {
    path: 'tabs/events/:id',
    loadChildren: () =>
      import('../news/event/detail/detail.module').then(
        (m) => m.DetailEventPageModule
      ),
  },
  {
    path: 'tabs/commerces/:id',
    loadChildren: () =>
      import('../commerce/detail/detail.module').then((m) => m.DetailPageModule),
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('../page/page-not-found/page-not-found.module').then(
        (m) => m.PageNotFoundPageModule
      ),
  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
