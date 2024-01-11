import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationPage } from './organization.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizationPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./organizations/organizations.module').then(
            (m) => m.OrganizationsPageModule
          ),
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./create/create.module').then((m) => m.CreatePageModule),
      },
      {
        path: 'update/:organizationId',
        loadChildren: () =>
          import('./update/update.module').then((m) => m.UpdatePageModule),
      },
      {
        path: ':organizationId',
        loadChildren: () =>
          import('./detail/detail.module').then((m) => m.DetailPageModule),
      },
      {
        path: 'create-branch/:organizationId',
        loadChildren: () =>
          import('./create/create.module').then((m) => m.CreatePageModule),
      },
      {
        path: ':organizationId/activity',
        loadChildren: () =>
          import('./activity/activity-organization.module').then(
            (m) => m.ActivityOrganizationPageModule
          ),
      },
      {
        path: 'commerce/create',
        loadChildren: () =>
          import('../commerce/create/create.module').then(
            (m) => m.CreateCommercePageModule
          ),
      },
      {
        path: 'event/create',
        loadChildren: () =>
          import('../news/event/create/create.module').then(
            (m) => m.CreateEventsPageModule
          ),
      },
      {
        path: 'news/create',
        loadChildren: () =>
          import('../news/create/create.module').then(
            (m) => m.CreateNewsPageModule
          ),
      },
      {
        path: 'opportunity/create',
        loadChildren: () =>
          import('../news/opportunity/create/create.module').then(
            (m) => m.CreateOpportunityPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationPageRoutingModule {}
