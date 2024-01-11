import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssuesPage } from './issues.page';

const routes: Routes = [
  {
    path: '',
    component: IssuesPage
  },
  {
    path: 'issue-create',
    loadChildren: () => import('./issue-create/issue-create.module').then( m => m.IssueCreatePageModule)
  },
  {
    path: ':issueId/issue-update',
    loadChildren: () => import('./issue-update/issue-update.module').then( m => m.IssueUpdatePageModule)
  },
  {
    path: ':issueId',
    loadChildren: () => import('./issue-detail/issue-detail.module').then( m => m.IssueDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuesPageRoutingModule {}
