import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyCreatePage } from './daily-create.page';

const routes: Routes = [
  {
    path: '',
    component: DailyCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyCreatePageRoutingModule {}
