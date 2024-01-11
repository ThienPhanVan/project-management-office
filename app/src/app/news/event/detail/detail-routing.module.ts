import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailEventPage } from './detail.page';

const routes: Routes = [
  {
    path: '',
    component: DetailEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailEventPageRoutingModule {}
