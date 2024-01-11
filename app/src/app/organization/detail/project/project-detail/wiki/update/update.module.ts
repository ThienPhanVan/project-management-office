import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePageRoutingModule } from './update-routing.module';

import { UpdatePage } from './update.page';
import { NgxEditorModule } from 'ngx-editor';
import { SharedModule } from '../../../../../../shared/shared.module';
import { VersionChangeComponent } from './version-change/version-change.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatePageRoutingModule,
    NgxEditorModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [UpdatePage, VersionChangeComponent]
})
export class WikiUpdatePageModule {}
