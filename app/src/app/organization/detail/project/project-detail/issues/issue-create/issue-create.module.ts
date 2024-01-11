import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueCreatePageRoutingModule } from './issue-create-routing.module';

import { IssueCreatePage } from './issue-create.page';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueCreatePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [IssueCreatePage]
})
export class IssueCreatePageModule {}
