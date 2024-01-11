import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyRegisterPageRoutingModule } from './verify-register-routing.module';

import { VerifyRegisterPage } from './verify-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyRegisterPageRoutingModule
  ],
  declarations: [VerifyRegisterPage]
})
export class VerifyRegisterPageModule {}
