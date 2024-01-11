import { CommonModule } from '@angular/common';
import { NgModule, Sanitizer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CountrySelectComponent } from './components/country-select/country-select.component';
import { IndustrySelectComponent } from './components/industry-select/industry-select.component';
import { ServiceSelectComponent } from './components/service-select/service-select.component';
import { CitySelectComponent } from './components/city-select/city-select.component';
import { ChapterListComponent } from './components/chapter-list/chapter-list.component';
import { PositionSelectComponent } from './components/position-select/position-select.component';
import { LanguageSelectComponent } from './components/language-select/language-select.component';
import { BaseSelectComponent } from './components/base-select/base-select.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ZoomComponent } from './components/zoom/zoom.component';
import { DisplayTotalPipe, SanitizedHtmlPipe } from './pipe';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { AvatarGroupComponent } from './components/avatar-group/avatar-group.component';
import { LongPressDirective } from './directives/long-press.directive';
import { CommerceListComponent } from './components/commerce-list/commerce-list.component';
import { HashtagMentionComponent } from './components/hashtag-mention/hashtag-mention.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { AttachmentChipComponent } from './components/message-input/attachment-chip/attachment-chip.component';
import { AttachmentSelectComponent } from './components/message-input/attachment-select/attachment-select.component';
import { AttachmentListComponent } from './components/attachment-list/attachment-list.component';
import { ImageGridComponent } from './components/attachment-list/image-grid/image-grid.component';
import { UsersFavoritesComponent } from './components/users-favorites-list/users-favorites-list.component';
import { BarReactComponent } from './components/bar-react/bar-react.component';
import { EmojiSelectComponent } from './components/emoji-select/emoji-select.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { PostCommentComponent } from './components/post-comment/post-comment.component';
import { DisplayActivityPipe } from './pipe/display-activity';
import { FormBidComponent } from './components/form-bid/form-bid.component';
import { NgxEditorModule } from 'ngx-editor';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { CategoriesSlideComponent } from './components/categories-slide/categories-slide.component';
import { AlbumImageComponent } from './components/album-image/album-image.component';
import { ItemsSelectComponent } from './components/items-select/items-select.component';
import { EventItemComponent } from './components/event-item/event-item.component';
import { FabListComponent } from './components/fab-list/fab-list.component';
import { ProductTwoColumnComponent } from './components/product-two-column/product-two-column.component';
import { OpportunityItemComponent } from './components/opportunity-item/opportunity-item.component';
import { HideNewsBoxComponent } from './components/hide-news-box/hide-news-box.component';
import { PriceInputComponent } from './components/price-input/price-input.component';
import { SendCommentComponent } from './components/send-comment/send-comment.component';
import { UsersFollowsComponent } from './components/user-follows-list/users-follows-list.component';
import { SkeletonNewsItemComponent } from './skeleton/skeleton-news-item/skeleton-news-item.component';
import { SkeletonEventItemComponent } from './skeleton/skeleton-event-item/skeleton-event-item.component';
import { SkeletonOpportunityItemComponent } from './skeleton/skeleton-opportunity-item/skeleton-opportunity-item.component';
import { SkeletonProductItemComponent } from './skeleton/skeleton-product-item/skeleton-product-item.component';
import { SkeletonUserProfileInfoComponent } from './skeleton/skeleton-user-profile-info/skeleton-user-profile-info.component';
import { PostHeaderComponent } from './components/post-header/post-header.component';
import { ReportFormComponent } from './components/report-form/report-form.component';
import { TagsListComponent } from './components/tags-list/tags-list.component';
import { ImagesListComponent } from './components/images-list/images-list.component';
import { PreviewImageComponent } from './components/preview-image/preview-image.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FeelingCreateNewComponent } from './components/feeling-create-new/feeling-create-new.component';
import { TagNameListComponent } from './components/tag-name-list/tag-name-list.component';
import { CategoriesFilterComponent } from './components/categories-filter/categories-filter.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { UserSegmentComponent } from './components/user-segment/user-segment.component';
import { AddressShippingCreateComponent } from './components/address-shipping-create/address-shipping-create.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxEditorModule,
    NgChartsModule,
    SlickCarouselModule,
  ],
  exports: [
    OrganizationListComponent,
    UserListComponent,
    TranslateModule,
    CountrySelectComponent,
    IndustrySelectComponent,
    ServiceSelectComponent,
    CitySelectComponent,
    ChapterListComponent,
    PositionSelectComponent,
    LanguageSelectComponent,
    BaseSelectComponent,
    AvatarComponent,
    ZoomComponent,
    DisplayTotalPipe,
    SanitizedHtmlPipe,
    NewsItemComponent,
    PostHeaderComponent,
    AvatarGroupComponent,
    LongPressDirective,
    CommerceListComponent,
    HashtagMentionComponent,
    MessageInputComponent,
    AttachmentChipComponent,
    AttachmentSelectComponent,
    AttachmentListComponent,
    ImageGridComponent,
    UsersFavoritesComponent,
    BarReactComponent,
    EmojiSelectComponent,
    CommentListComponent,
    PostCommentComponent,
    DisplayActivityPipe,
    FormBidComponent,
    ReactionsComponent,
    CategoriesSlideComponent,
    AlbumImageComponent,
    ItemsSelectComponent,
    TagNameListComponent,
    EventItemComponent,
    FabListComponent,
    ProductTwoColumnComponent,
    OpportunityItemComponent,
    HideNewsBoxComponent,
    PriceInputComponent,
    SendCommentComponent,
    UsersFollowsComponent,
    ReportFormComponent,
    SkeletonNewsItemComponent,
    SkeletonEventItemComponent,
    SkeletonOpportunityItemComponent,
    SkeletonProductItemComponent,
    SkeletonUserProfileInfoComponent,
    TagsListComponent,
    ImagesListComponent,
    PreviewImageComponent,
    FeelingCreateNewComponent,
    CategoriesFilterComponent,
    OrderListComponent,
    UserSegmentComponent,
    AddressShippingCreateComponent,
  ],
  declarations: [
    OrganizationListComponent,
    UserListComponent,
    CountrySelectComponent,
    IndustrySelectComponent,
    ServiceSelectComponent,
    CitySelectComponent,
    ChapterListComponent,
    PositionSelectComponent,
    LanguageSelectComponent,
    BaseSelectComponent,
    AvatarComponent,
    ZoomComponent,
    DisplayTotalPipe,
    SanitizedHtmlPipe,
    NewsItemComponent,
    PostHeaderComponent,
    AvatarGroupComponent,
    LongPressDirective,
    CommerceListComponent,
    HashtagMentionComponent,
    MessageInputComponent,
    AttachmentChipComponent,
    AttachmentSelectComponent,
    AttachmentListComponent,
    ImageGridComponent,
    UsersFavoritesComponent,
    BarReactComponent,
    EmojiSelectComponent,
    CommentListComponent,
    PostCommentComponent,
    DisplayActivityPipe,
    FormBidComponent,
    ReactionsComponent,
    CategoriesSlideComponent,
    AlbumImageComponent,
    ItemsSelectComponent,
    TagNameListComponent,
    EventItemComponent,
    FabListComponent,
    ProductTwoColumnComponent,
    OpportunityItemComponent,
    HideNewsBoxComponent,
    PriceInputComponent,
    SendCommentComponent,
    UsersFollowsComponent,
    ReportFormComponent,
    SkeletonNewsItemComponent,
    SkeletonEventItemComponent,
    SkeletonOpportunityItemComponent,
    SkeletonProductItemComponent,
    SkeletonUserProfileInfoComponent,
    TagsListComponent,
    ImagesListComponent,
    PreviewImageComponent,
    FeelingCreateNewComponent,
    CategoriesFilterComponent,
    OrderListComponent,
    UserSegmentComponent,
    AddressShippingCreateComponent,
  ],
  providers: [],
})
export class SharedModule {}
