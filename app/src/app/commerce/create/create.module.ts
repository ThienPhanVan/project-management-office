import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCommercePageRoutingModule } from './create-routing.module';
import { CreateCommercePage } from './create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCommercePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateCommercePage],
})
export class CreateCommercePageModule {}
