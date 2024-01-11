import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintainServicePageRoutingModule } from './maintain-service-routing.module';

import { MaintainServicePage } from './maintain-service.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MaintainServicePageRoutingModule
  ],
  declarations: [MaintainServicePage]
})
export class MaintainServicePageModule {}
