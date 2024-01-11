import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsandpolicyPageRoutingModule } from './terms-policy-routing.module';

import { TermsandpolicyPage } from './terms-policy.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TermsandpolicyPageRoutingModule
  ],
  declarations: [TermsandpolicyPage]
})
export class TermsandpolicyPageModule {}
