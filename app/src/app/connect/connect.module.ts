import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectPageRoutingModule } from './connect-routing.module';

import { ConnectPage } from './connect.page';
import { SharedModule } from '../shared/shared.module';
import { MenuGroupComponent } from './menu/menu.component';
import { ChangeNameComponent } from './menu/change-name/change-name.component';
import { NotificationComponent } from './menu/notification/notification.component';
import { InviteUserGroupConnectComponent } from './menu/invite-user/invite-user.component';
import { MessageActionListComponent } from './action-list/message-action-list.component';
import { ContactPage } from './contact/contact.page';
import { WaitingMessagePage } from './waiting-message/waiting-message.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPageRoutingModule,
    SharedModule,
    MessageActionListComponent,
  ],
  exports: [
    MenuGroupComponent,
    ChangeNameComponent,
    NotificationComponent,
    InviteUserGroupConnectComponent,
  ],
  declarations: [
    ConnectPage,
    MenuGroupComponent,
    ChangeNameComponent,
    NotificationComponent,
    InviteUserGroupConnectComponent,
    ContactPage,
    WaitingMessagePage
  ],
})
export class ConnectPageModule {}
