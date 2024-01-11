import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { SharedModule } from '../../shared/shared.module';

import { InviteUserChapterComponent } from './invite-user/invite-user.component';
import { UserListChapterInviteComponent } from './invite-user/user-list/user-list-invite.component';
import { InviteOrganizationChapterComponent } from './invite-organization/invite-organization.component';
import { OrganizationListChapterInviteComponent } from './invite-organization/organization-list/organization-list-invite.component';
import { UserListChapterDetailComponent } from './user-list/user-list.component';
import { AboutSegmentComponent } from './about-segment/about-segment.component';
import { TimelineSegmentComponent } from './timeline-segment/timeline-segment.component';
import { CommerceSegmentComponent } from './commerce-segment/commerce-segment.component';
import { UserRequestComponent } from './user-request/user-request.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DetailPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DetailPage,
    InviteUserChapterComponent,
    UserListChapterInviteComponent,
    InviteOrganizationChapterComponent,
    OrganizationListChapterInviteComponent,
    UserListChapterDetailComponent,
    AboutSegmentComponent,
    TimelineSegmentComponent,
    CommerceSegmentComponent,
    UserRequestComponent,
  ],
})
export class DetailPageModule {}
