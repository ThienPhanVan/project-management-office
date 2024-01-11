import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/shared/shared.module';
import { DetailEventPage } from './detail.page';
import { DetailEventPageRoutingModule } from './detail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailEventPageRoutingModule,
    SharedModule,
    
    
  ],
  declarations: [DetailEventPage]
})
export class DetailEventPageModule {}
