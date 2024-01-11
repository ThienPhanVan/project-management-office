import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintainServicePage } from './maintain-service.page';

const routes: Routes = [
  {
    path: '',
    component: MaintainServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintainServicePageRoutingModule {}
