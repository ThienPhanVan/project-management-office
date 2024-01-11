import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpportunityDetailComponentRoutingModule } from './detail-routing.module';

import { OpportunityDetailComponent } from './detail.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpportunityDetailComponentRoutingModule,
    SharedModule,
  ],
  declarations: [OpportunityDetailComponent],
})
export class OpportunityDetailComponentModule {}
