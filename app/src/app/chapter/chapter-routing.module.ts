import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChapterPage } from './chapter.page';

const routes: Routes = [
  {
    path: '',
    component: ChapterPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./chapters/chapters.module').then(
            (m) => m.ChaptersPageModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchPageModule),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./detail/detail.module').then((m) => m.DetailPageModule),
      },
      {
        path: ':id/activity',
        loadChildren: () =>
          import('./activity/activity-chapter.module').then(
            (m) => m.ActivityChapterPageModule
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChapterPageRoutingModule {}
