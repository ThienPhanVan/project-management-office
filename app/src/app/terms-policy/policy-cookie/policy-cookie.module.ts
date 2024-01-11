import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolicycookiePageRoutingModule } from './policy-cookie-routing.module';

import { PolicycookiePage } from './policy-cookie.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PolicycookiePageRoutingModule
  ],
  declarations: [PolicycookiePage]
})
export class PolicycookiePageModule {}
