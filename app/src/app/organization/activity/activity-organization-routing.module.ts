import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityOrganizationPage } from './activity-organization.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityOrganizationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityOrganizationPageRoutingModule {}
