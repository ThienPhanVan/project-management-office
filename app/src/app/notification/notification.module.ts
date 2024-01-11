import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationPageRoutingModule } from './notification-routing.module';
import { NotificationPage } from './notification.page';
import { NotificationReactionComponent } from './notification-reaction/notification-reaction.component';
import { NotificationAcceptFriendComponent } from './notification-accept-friend/notification-accept-friend.component';
import { NotificationRequestFriendComponent } from './notification-request-friend/notification-request-friend.component';
import { NotificationCreateNewsComponent } from './notification-create-news/notification-create-news.component';
import { NotificationCommentNewsComponent } from './notification-comment-news/notification-comment-news.component';
import { NotificationBidComponent } from './notification-bid/notification-bid.component';
import { NotificationMentionNewsComponent } from './notification-mention-news/notification-mention-news.component';
import { NotificationCreateEventComponent } from './notification-create-event/notification-create-event.component';
import { NotificationCreateOpportunityComponent } from './notification-create-opportunity/notification-create-opportunity.component';
import { NotificationParticipateEventComponent } from './notification-participate-event/notification-participate-event.component';
import { NotificationOrgCreateNewsComponent } from './notification-org-create-news/notification-org-create-news.component';
import { NotificationOrgCreateEventComponent } from './notification-org-create-event/notification-org-create-event.component';
import { NotificationOrgCreateOpportunityComponent } from './notification-org-create-opportunity/notification-org-create-opportunity.component';
import { NotificationFollowingComponent } from './notification-following/notification-following.component';
import { NotificationReplyCommentNewsComponent } from './notification-reply-comment-news/notification-reply-comment-news.component';
import { NotificationReplyCommentProductComponent } from './notification-reply-comment-product/notification-reply-comment-product.component';
import { NotificationCommentProductComponent } from './notification-comment-product/notification-comment-product.component';
import { NotificationCreateProductComponent } from './notification-create-product/notification-create-product.component';
import { NotificationMentionCommentComponent } from './notification-mention-comment/notification-mention-comment.component';
import { NotificationAssigneeIssueComponent } from './notification-assignee-issue/notification-assignee-issue.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    NotificationPage,
    NotificationReactionComponent,
    NotificationAcceptFriendComponent,
    NotificationRequestFriendComponent,
    NotificationCreateNewsComponent,
    NotificationCommentNewsComponent,
    NotificationBidComponent,
    NotificationMentionNewsComponent,
    NotificationMentionCommentComponent,
    NotificationCreateEventComponent,
    NotificationCreateOpportunityComponent,
    NotificationParticipateEventComponent,
    NotificationOrgCreateNewsComponent,
    NotificationOrgCreateEventComponent,
    NotificationOrgCreateOpportunityComponent,
    NotificationFollowingComponent,
    NotificationReplyCommentNewsComponent,
    NotificationReplyCommentProductComponent,
    NotificationCommentProductComponent,
    NotificationCreateProductComponent,
    NotificationAssigneeIssueComponent,
  ],
})
export class NotificationPageModule {}
