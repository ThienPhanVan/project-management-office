import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitmentPage } from './commitment.page';

const routes: Routes = [
  {
    path: '',
    component: CommitmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitmentPageRoutingModule {}
