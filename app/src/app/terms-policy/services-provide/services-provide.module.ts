import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesProvidePageRoutingModule } from './services-provide-routing.module';

import { ServicesProvidePage } from './services-provide.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ServicesProvidePageRoutingModule
  ],
  declarations: [ServicesProvidePage]
})
export class ServicesProvidePageModule {}
