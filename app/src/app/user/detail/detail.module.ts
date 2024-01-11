import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { AboutSegmentComponent } from './about-segment/about-segment.component';
import { TimelineSegmentComponent } from './timeline-segment/timeline-segment.component';
import { CommerceSegmentComponent } from './commerce-segment/commerce-segment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    DetailPage,
    MemberDetailComponent,
    UserInfoComponent,
    AboutSegmentComponent,
    TimelineSegmentComponent,
    CommerceSegmentComponent,
  ],
})
export class DetailPageModule {}
