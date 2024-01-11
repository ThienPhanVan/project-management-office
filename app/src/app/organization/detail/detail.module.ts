import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { UserListOrganizationComponent } from './user-list/user-list.component';
import { InviteUserOrganizationComponent } from './invite-user/invite-user.component';
import { UserListOrganizationInviteComponent } from './invite-user/user-list/user-list.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { AboutSegmentComponent } from './about-segment/about-segment.component';
import { TimelineSegmentComponent } from './timeline-segment/timeline-segment.component';
import { CommerceSegmentComponent } from './commerce-segment/commerce-segment.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    DetailPage,
    UserListOrganizationComponent,
    InviteUserOrganizationComponent,
    UserListOrganizationInviteComponent,
    ProjectListComponent,
    AboutSegmentComponent,
    TimelineSegmentComponent,
    CommerceSegmentComponent,
    OrganizationInfoComponent
  ],
})
export class DetailPageModule {}
