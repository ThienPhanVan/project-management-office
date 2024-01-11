import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WikiPageRoutingModule } from './wiki-routing.module';

import { WikiPage } from './wiki.page';
import { WikiListComponent } from './list/list.component';
import { SharedModule } from '../../../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WikiPageRoutingModule,
    SharedModule
  ],
  declarations: [WikiPage, WikiListComponent],
})
export class WikiPageModule {}
