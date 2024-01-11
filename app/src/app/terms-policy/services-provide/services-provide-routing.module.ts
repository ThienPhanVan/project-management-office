import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesProvidePage } from './services-provide.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesProvidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesProvidePageRoutingModule {}
