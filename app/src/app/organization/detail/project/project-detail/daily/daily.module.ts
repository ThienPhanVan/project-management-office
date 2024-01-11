import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyPageRoutingModule } from './daily-routing.module';

import { DailyPage } from './daily.page';
import { DailyListComponent } from './daily-list/daily-list.component';
import { DailyIssueItemComponent } from './daily-issue-item/daily-issue-item.component';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyPageRoutingModule,
    SharedModule
  ],
  declarations: [DailyPage, DailyListComponent, DailyIssueItemComponent]
})
export class DailyPageModule {}
