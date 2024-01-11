import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPolicyPageRoutingModule } from './data-policy-routing.module';

import { DataPolicyPage } from './data-policy.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DataPolicyPageRoutingModule
  ],
  declarations: [DataPolicyPage]
})
export class DataPolicyPageModule {}
