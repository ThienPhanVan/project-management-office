import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityUserPage } from './activity-user.page';


const routes: Routes = [
  {
    path: '',
    component: ActivityUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityUserPageRoutingModule {}
