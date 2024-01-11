import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueUpdatePage } from './issue-update.page';

const routes: Routes = [
  {
    path: '',
    component: IssueUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueUpdatePageRoutingModule {}
