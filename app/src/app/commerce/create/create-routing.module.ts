import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCommercePage } from './create.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCommercePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCommercePageRoutingModule {}
