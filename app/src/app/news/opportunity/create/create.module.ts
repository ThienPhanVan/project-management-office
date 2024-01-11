import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateOpportunityPage } from './create.page';
import { CreateOpportunityPageRoutingModule } from './create-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateOpportunityPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxEditorModule,
  ],
  declarations: [CreateOpportunityPage],
})
export class CreateOpportunityPageModule {}
