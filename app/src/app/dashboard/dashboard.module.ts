import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { ChartDoughnutComponent } from './chart-doughnut/chart-doughnut.component';

@NgModule({
  declarations: [DashboardPage, ChartDoughnutComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgChartsModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
