import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueDetailPage } from './issue-detail.page';

const routes: Routes = [
  {
    path: '',
    component: IssueDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueDetailPageRoutingModule {}
