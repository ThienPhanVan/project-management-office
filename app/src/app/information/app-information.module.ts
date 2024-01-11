import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppInformationPageRoutingModule } from './app-information-routing.module';

import { AppInformationPage } from './app-information.page';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppInformationPageRoutingModule,
    SharedModule
  ],
  declarations: [AppInformationPage]
})
export class AppInformationPageModule {}
