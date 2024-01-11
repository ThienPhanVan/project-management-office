import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateEventsPage } from './create.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateEventsPageRoutingModule } from './create-routing.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEventsPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxEditorModule,
  ],
  declarations: [CreateEventsPage],
})
export class CreateEventsPageModule {}
