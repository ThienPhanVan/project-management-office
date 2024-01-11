import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssuesPageRoutingModule } from './issues-routing.module';

import { IssuesPage } from './issues.page';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueFilterComponent } from './issue-filter/issue-filter.component';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssuesPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [IssuesPage, IssueListComponent, IssueFilterComponent],
})
export class IssuesPageModule {}
