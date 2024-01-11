import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityOrganizationPageRoutingModule } from './activity-organization-routing.module';

import { ActivityOrganizationPage } from './activity-organization.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityOrganizationPageRoutingModule,
    SharedModule
  ],
  declarations: [
    ActivityOrganizationPage
  ],
})
export class ActivityOrganizationPageModule {}
