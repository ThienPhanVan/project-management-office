import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { HistoryLoginPage } from './history-login.page';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { HistoryLoginPageRoutingModule } from './history-login-routing.module';

@NgModule({
    declarations: [HistoryLoginPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        HttpClientModule,
        HistoryLoginPageRoutingModule
    ],
    providers: [AuthService]
})
export class HistoryLoginPageModule {}
