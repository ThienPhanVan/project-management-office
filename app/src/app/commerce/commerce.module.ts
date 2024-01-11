import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommercePageRoutingModule } from './commerce-routing.module';

import { CommercePage } from './commerce.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommercePageRoutingModule
  ],
  declarations: [CommercePage]
})
export class CommercePageModule {}
