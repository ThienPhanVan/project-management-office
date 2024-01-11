import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypesPageRoutingModule } from './types-routing.module';

import { TypesPage } from './types.page';
import { TypeListComponent } from './type-list/type-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypesPageRoutingModule
  ],
  declarations: [TypesPage, TypeListComponent]
})
export class TypesPageModule {}
