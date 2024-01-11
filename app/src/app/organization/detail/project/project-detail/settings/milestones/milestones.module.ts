import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MilestonesPageRoutingModule } from './milestones-routing.module';

import { MilestonesPage } from './milestones.page';
import { MilestoneListComponent } from './milestone-list/milestone-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MilestonesPageRoutingModule
  ],
  declarations: [MilestonesPage, MilestoneListComponent]
})
export class MilestonesPageModule {}
