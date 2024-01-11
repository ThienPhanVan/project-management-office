import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsByHashtagPage } from './news-by-hashtag.page';

const routes: Routes = [
  {
    path: '',
    component: NewsByHashtagPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsByHashtagPageRoutingModule {}
