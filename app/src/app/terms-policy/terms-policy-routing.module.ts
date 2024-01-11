import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsandpolicyPage } from './terms-policy.page';

const routes: Routes = [
  {
    path: '',
    component: TermsandpolicyPage
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'policy-cookie',
    loadChildren: () => import('./policy-cookie/policy-cookie.module').then( m => m.PolicycookiePageModule)
  },
  {
    path: 'data-policy',
    loadChildren: () => import('./data-policy/data-policy.module').then( m => m.DataPolicyPageModule)
  },
  {
    path: 'services-provide',
    loadChildren: () => import('./services-provide/services-provide.module').then( m => m.ServicesProvidePageModule)
  },
  {
    path: 'maintain-service',
    loadChildren: () => import('./maintain-service/maintain-service.module').then( m => m.MaintainServicePageModule)
  },
  {
    path: 'commitment',
    loadChildren: () => import('./commitment/commitment.module').then( m => m.CommitmentPageModule)
  },
  {
    path: 'additional-regulations',
    loadChildren: () => import('./additional-regulations/additional-regulations.module').then( m => m.AdditionalRegulationsPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsandpolicyPageRoutingModule {}
