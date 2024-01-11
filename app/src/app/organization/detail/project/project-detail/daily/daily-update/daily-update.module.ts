import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyUpdatePageRoutingModule } from './daily-update-routing.module';

import { DailyUpdatePage } from './daily-update.page';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyUpdatePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [DailyUpdatePage]
})
export class DailyUpdatePageModule {}
