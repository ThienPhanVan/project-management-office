import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterInvitedPageRoutingModule } from './register-invited-routing.module';
import { RegisterInvitedPage } from './register-invited.page';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterInvitedPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [RegisterInvitedPage]
})
export class RegisterInvitedPageModule {}
