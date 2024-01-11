import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueDetailPageRoutingModule } from './issue-detail-routing.module';

import { IssueDetailPage } from './issue-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import {IssueCommentComponent} from './issue-comment/issue-comment.component'
import { ChecklistListComponent } from '../checklist-list/checklist-list.component';
import { ChecklistCreateComponent } from '../checklist-create/checklist-create.component';
import { ActivityListComponent } from '../activity-list/activity-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IssueDetailPageRoutingModule,
    SharedModule,
    
  ],
  declarations: [IssueDetailPage, IssueCommentComponent, ChecklistListComponent, ChecklistCreateComponent, ActivityListComponent]
})
export class IssueDetailPageModule {}
