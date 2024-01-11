import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { WikiCreatePage } from './create.page';
import { NgxEditorModule } from 'ngx-editor';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule,
    NgxEditorModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [WikiCreatePage],
})
export class WikiCreatePageModule {}
