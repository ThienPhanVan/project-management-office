import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusesPage } from './status.page';


const routes: Routes = [
  {
    path: '',
    component: StatusesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusPageRoutingModule {}
