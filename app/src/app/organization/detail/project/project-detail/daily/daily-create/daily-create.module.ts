import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyCreatePageRoutingModule } from './daily-create-routing.module';

import { DailyCreatePage } from './daily-create.page';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyCreatePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [DailyCreatePage]
})
export class DailyCreatePageModule {}
