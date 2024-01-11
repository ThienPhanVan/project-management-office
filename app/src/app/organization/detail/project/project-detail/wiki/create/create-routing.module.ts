import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WikiCreatePage } from './create.page';

const routes: Routes = [
  {
    path: '',
    component: WikiCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePageRoutingModule {}
