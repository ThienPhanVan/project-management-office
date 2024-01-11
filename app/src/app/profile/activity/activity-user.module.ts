import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityUserPageRoutingModule } from './activity-user-routing.module';

import { ActivityUserPage } from './activity-user.page';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityUserPageRoutingModule,
    SharedModule
  ],
  declarations: [
    ActivityUserPage
  ],
})
export class ActivityUserPageModule {}
