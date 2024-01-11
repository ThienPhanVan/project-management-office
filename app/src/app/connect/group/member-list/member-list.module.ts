import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberListPageRoutingModule } from './member-list-routing.module';

import { MemberListPage } from './member-list.page';
import { MemberActionComponent } from './member-action/member-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberListPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [MemberListPage,MemberActionComponent]
})
export class MemberListPageModule {}
