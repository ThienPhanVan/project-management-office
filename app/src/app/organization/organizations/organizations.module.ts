import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizationsPageRoutingModule } from './organizations-routing.module';

import { OrganizationsPage } from './organizations.page';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { OrganizationsService } from '../../services/organization.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    OrganizationsPageRoutingModule,
    SharedModule,
  ],
  declarations: [OrganizationsPage],
  providers: [OrganizationsService]
})
export class OrganizationsPageModule {}
