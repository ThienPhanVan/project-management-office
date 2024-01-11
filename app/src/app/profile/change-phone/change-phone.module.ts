import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePhonePageRoutingModule } from './change-phone-routing.module';

import { ChangePhonePage } from './change-phone.page';
import { AuthService } from '../../services/auth.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePhonePageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ChangePhonePage],
  providers: [AuthService]
})
export class ChangePhonePageModule {}
