import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyPage } from './daily.page';

const routes: Routes = [
  {
    path: '',
    component: DailyPage
  },
  {
    path: 'create',
    loadChildren: () => import('./daily-create/daily-create.module').then( m => m.DailyCreatePageModule)
  },
  {
    path: ':dailyId/update',
    loadChildren: () => import('./daily-update/daily-update.module').then( m => m.DailyUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyPageRoutingModule {}
