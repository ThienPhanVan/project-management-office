import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectPage } from './project.page';

@NgModule({
  declarations: [ProjectPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProjectRoutingModule,
  ],
})
export class ProjectModule {}
