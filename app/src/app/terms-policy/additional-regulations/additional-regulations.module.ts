import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdditionalRegulationsPageRoutingModule } from './additional-regulations-routing.module';

import { AdditionalRegulationsPage } from './additional-regulations.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AdditionalRegulationsPageRoutingModule
  ],
  declarations: [AdditionalRegulationsPage]
})
export class AdditionalRegulationsPageModule {}
