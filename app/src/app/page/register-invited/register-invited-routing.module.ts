import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterInvitedPage } from './register-invited.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterInvitedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterInvitedPageRoutingModule {}
