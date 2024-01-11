import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThreadPageRoutingModule } from './thread-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ThreadPage } from './thread.page';
import { MessageListThreadComponent } from './message-list/message-list.component';
import { MessageActionListComponent } from '../action-list/message-action-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThreadPageRoutingModule,
    SharedModule,
    MessageActionListComponent
  ],
  declarations: [ThreadPage, MessageListThreadComponent]
})
export class ThreadPageModule {}
