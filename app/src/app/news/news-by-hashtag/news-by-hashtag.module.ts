import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsByHashtagPage } from './news-by-hashtag.page';
import { SharedModule } from '../../../app/shared/shared.module';
import { NewsByHashtagPageRoutingModule } from './news-by-hashtag-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsByHashtagPageRoutingModule,
    SharedModule,
  ],
  declarations: [NewsByHashtagPage],
})
export class NewsHashtagPageModule {}
