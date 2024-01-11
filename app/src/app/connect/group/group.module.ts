import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupPageRoutingModule } from './group-routing.module';

import { GroupPage } from './group.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageComponent } from './message-list/message-list.component';
import { ConnectPageModule } from '../connect.module';
import { MessageActionListComponent } from '../action-list/message-action-list.component';
import { EmojiChipListComponent } from '../emoji-chip-list/emoji-chip-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupPageRoutingModule,
    SharedModule,
    ConnectPageModule,
    MessageActionListComponent,
    EmojiChipListComponent
  ],
  declarations: [
    GroupPage,
    MessageComponent,
  ],
})
export class GroupPageModule {}
