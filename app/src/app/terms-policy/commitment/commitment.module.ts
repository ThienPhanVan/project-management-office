import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitmentPageRoutingModule } from './commitment-routing.module';

import { CommitmentPage } from './commitment.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CommitmentPageRoutingModule
  ],
  declarations: [CommitmentPage]
})
export class CommitmentPageModule {}
