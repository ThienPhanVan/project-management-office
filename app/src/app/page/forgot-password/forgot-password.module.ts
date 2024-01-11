import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordPage } from './forgot-password.page';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ForgotPasswordPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [ForgotPasswordPage],
  providers: [AuthService]
})
export class ForgotPasswordPageModule {}
