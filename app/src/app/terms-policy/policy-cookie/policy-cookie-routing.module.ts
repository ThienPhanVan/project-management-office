import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolicycookiePage } from './policy-cookie.page';

const routes: Routes = [
  {
    path: '',
    component: PolicycookiePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicycookiePageRoutingModule {}
