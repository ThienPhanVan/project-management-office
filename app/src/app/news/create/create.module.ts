import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewsPageRoutingModule } from './create-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { CreateNewsPage } from './create.page';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewsPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxEditorModule,
  ],
  declarations: [CreateNewsPage],
})
export class CreateNewsPageModule {}
