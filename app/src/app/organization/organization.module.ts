import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { OrganizationPageRoutingModule } from './organization-routing.module';

import { OrganizationPage } from './organization.page';
import { OrganizationsService } from '../services/organization.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    OrganizationPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [OrganizationPage],
  providers: [OrganizationsService]
})
export class OrganizationPageModule {}
