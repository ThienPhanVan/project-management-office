import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE_STATUS } from '../../../constant';
import { IAttachment, IMessage, IEmojiUsers, Message } from 'src/app/interface';
import * as _ from 'lodash';
import { MasterDataService } from '../../../shared/services';
import * as moment from 'moment';
import { ConversationService } from 'src/app/services/conversation.service';
import { UserReactionComponent } from './users-reaction/user-reaction.component';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services';
import { PreviewVideoComponent } from 'src/app/shared/components/preview-video/preview-video.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-message-list-group',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Output() imageClicked = new EventEmitter();
  @Output() getThumbnail = new EventEmitter<string>();
  @Output() videoClicked = new EventEmitter();

  isAvatar: boolean = true;
  imagesString: any;
  videoString: any;
  showZoomAvatar: boolean = false;
  selectedMessage: Message | null = null;
  pinnedMessage: [] = [];
  messageStatus = MESSAGE_STATUS;
  isHovered: boolean = false;
  @ViewChild('pinnedMessageContainer') pinnedMessageContainer!: ElementRef;
  @ViewChild('appPreviewVideo') previewVideoComponent:
    | PreviewVideoComponent
    | undefined;
  latestPinMessage: any = undefined;
  me: any;
  sanitizedHtml!: SafeHtml

  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private conversationService: ConversationService,
    private modalCtrl: ModalController,
    private el: ElementRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.messages.reverse();
    this.getMe();
    this.route.paramMap.subscribe((params) => {
      const groupId = params.get('groupId');
      if (groupId !== null) {
        this.conversationService
          .getMessagePin(groupId)
          .subscribe((res: any) => {
            this.pinnedMessage = res.data;
            if (!_.isEmpty(this.pinnedMessage)) {
              _.sortBy(this.pinnedMessage, (message: any) => {
                return message.updated_date;
              });
              this.latestPinMessage = _.last(this.pinnedMessage);
            }
          });
      }
    });
  }

  isLink(text: string): boolean {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(text);
    return linkRegex.test(this.sanitizedHtml.toString());
  }

  isVideoUrl(url: string): boolean {
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv'];
    const fileExtension = url.split('.').pop()?.toLowerCase();
    return fileExtension ? videoExtensions.includes(fileExtension) : false;
  }

  getMe() {
    this.authService.me().subscribe((res: any) => {
      this.me = res;
    });
  }

  scrollToMessage(messageId: string) {
    const messageElement = this.el.nativeElement.querySelector(
      `#message-${messageId}`
    );
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onReactionsHandler(event: any) {
    console.log('Emoji Selected:', event);
  }

  showAction(event: any) {
    this.conversationService.deletePinMessage(event.id).subscribe((res) => {
      console.log(
        'BE delete pin đang trả ra lỗi nên không render được :',
        event.id
      );
    });
  }

  setHover(value: boolean): void {
    this.isHovered = value;
  }

  formatUpdateTime(updatedDate: string): string {
    return moment(updatedDate).fromNow();
  }

  isMyMessage(message: any) {
    if (message) {
      return message.created_by === this.getMyId();
    }
    return false;
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  redirectThread(message: any) {
    if (message.id) {
      this.router.navigate(['thread/' + message.id]);
    }
  }

  emojiChanged(messageNew: Message, ev: any) {
    const index = this.messages.findIndex((msg) => msg.id === messageNew.id);
    if (index !== -1) {
      this.messages[index] = messageNew;
      this.messages = [...this.messages];
    }
  }

  emojiUnselect(emojiUsers: IEmojiUsers[], message: IMessage) {
    message.emojis = emojiUsers;
  }

  onDeleteMessage(deletedMessage: any) {
    const updatedMessage = deletedMessage;
    const deletedIndex = this.messages.findIndex(
      (message) => message.id === deletedMessage.id
    );
    if (deletedIndex !== -1) {
      this.messages[deletedIndex] = updatedMessage;
    }
  }

  getRemainingReactionsCount(message: {
    message_reactions: string | any[];
  }): number {
    const maxReactionsToShow = 1;
    if (message && message.message_reactions) {
      const remainingCount =
        message.message_reactions.length - maxReactionsToShow;
      return remainingCount > 0 ? remainingCount : 0;
    }
    return 0;
  }

  async presentModal(message: any) {
    this.conversationService
      .getUserReaction(message.id)
      .subscribe(async (res) => {
        const modal = this.modalCtrl.create({
          component: UserReactionComponent,
          componentProps: {
            message: res.data,
          },
          breakpoints: [0.5, 0, 0, 1],
          initialBreakpoint: 0.5,
        });
        (await modal).present();
      });
  }

  shouldDisplaySameUserStyles(
    currentMessage: any,
    previousMessage: any
  ): boolean {
    if (!currentMessage || !currentMessage.user) {
      return false;
    }
    if (!previousMessage || !previousMessage.user) {
      return true;
    }
    return currentMessage.user.id !== previousMessage.user.id;
  }

  showZoomModal: boolean = false;

  onImageClicked(image: any) {
    this.showZoomModal = true;
    this.imagesString = image;
  }

  closeModal(value: boolean) {
    this.showZoomModal = false;
    this.imagesString = '';
  }

  closeVideoModal(value : boolean) {
    this.showZoomModal = false;
    this.videoString = '';
  }

  showVideoModal: boolean = false;
  onVideoClicked(url: string) {
    this.videoString = url
    this.showVideoModal = true
    console.log('video')
  }
}
