import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';

const routes: Routes = [
  {
    path: '',
    component: NewsPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./news/news.module').then((m) => m.NewsPageModule),
      },
      {
        path: 'hashtag',
        loadChildren: () =>
          import('./news-by-hashtag/news-by-hashtag.module').then(
            (m) => m.NewsHashtagPageModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchPageModule),
      },

      // {
      //   path: 'news/user/:userId',
      //   loadChildren: () =>
      //     import('./news/news.module').then((m) => m.NewsPageModule),
      // },
      // {
      //   path: 'news/org/:orgId',
      //   loadChildren: () =>
      //     import('./news/news.module').then((m) => m.NewsPageModule),
      // },
      // {
      //   path: 'news/chapter/:chapterId',
      //   loadChildren: () =>
      //     import('./news/news.module').then((m) => m.NewsPageModule),
      // },

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
export class NewsPageRoutingModule {}
