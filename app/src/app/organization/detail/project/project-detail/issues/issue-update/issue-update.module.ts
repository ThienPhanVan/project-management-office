import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueUpdatePageRoutingModule } from './issue-update-routing.module';

import { IssueUpdatePage } from './issue-update.page';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueUpdatePageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [IssueUpdatePage],
})
export class IssueUpdatePageModule {}
