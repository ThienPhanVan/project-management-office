import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WikiPage } from './wiki.page';

const routes: Routes = [
  {
    path: '',
    component: WikiPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.WikiCreatePageModule)
  },
  {
    path: ':wikiId',
    loadChildren: () => import('./detail/detail.module').then( m => m.WikiDetailPageModule)
  },
  {
    path: ':wikiId/update',
    loadChildren: () => import('./update/update.module').then( m => m.WikiUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WikiPageRoutingModule {}
