import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TermsPolicyPageRoutingModule } from './terms-policy-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TermsPolicyPage } from './terms-policy.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsPolicyPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [TermsPolicyPage]
})
export class TermsPolicyPageModule {}
