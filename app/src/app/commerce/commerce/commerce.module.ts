import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommercePageRoutingModule } from './commerce-routing.module';

import { CommercePage } from './commerce.page';
import { SharedModule } from '../../shared/shared.module';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommercePageRoutingModule,
    SharedModule
  ],
  declarations: [
    CommercePage,
    MenuComponent,
    ]
})
export class CommercePageModule {}
