import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueCreatePage } from './issue-create.page';

const routes: Routes = [
  {
    path: '',
    component: IssueCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueCreatePageRoutingModule {}
