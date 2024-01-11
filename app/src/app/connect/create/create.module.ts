import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { SharedModule } from '../../shared/shared.module';
import { UserChipListComponent } from './user-chip-list/user-chip-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule,
    SharedModule,
  ],
  declarations: [CreatePage, UserChipListComponent],
})
export class CreatePageModule {}
