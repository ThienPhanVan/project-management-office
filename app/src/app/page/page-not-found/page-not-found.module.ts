import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundPage } from './page-not-found.page';

import { PageNotFoundPageRoutingModule } from './page-not-found-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    PageNotFoundPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [PageNotFoundPage],
  providers: [AuthService],
})
export class PageNotFoundPageModule {}
