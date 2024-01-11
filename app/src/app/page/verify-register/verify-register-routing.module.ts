import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyRegisterPage } from './verify-register.page';

const routes: Routes = [
  {
    path: '',
    component: VerifyRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifyRegisterPageRoutingModule {}
