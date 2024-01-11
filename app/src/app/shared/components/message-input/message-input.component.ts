import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { IAttachment, Message } from '../../../interface';
import * as _ from 'lodash';
import { URL_PATTERN } from '../../../constant';
import { MessageUpdateService } from '../../services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent implements OnInit, OnChanges {
  @Input() replies: any;
  @Input() message: string = '';
  @Output() messageChange = new EventEmitter();
  @Output() removeReply = new EventEmitter();
  newMessage: string = '';
  isEmojiVisible: boolean = true;

  selectedAttachments: IAttachment[] = [];
  subscription: Subscription;

  constructor(messageService: MessageUpdateService, private translate: TranslateService) {
    this.subscription = messageService.messageUpdated$.subscribe(
      (updatedMessage: Message) => {
        if(updatedMessage && updatedMessage.description)
        this.newMessage = updatedMessage.description
      }
    );
  }

  ngOnInit() {}

  ngOnChanges(samples: any) {
    if (this.message !== '') {
      this.newMessage = this.message;
    }
    // console.log(1232132, this.replies);
  }

  attachmentSelected(attachment: any) {
    if (_.findIndex(this.selectedAttachments, attachment) === -1) {
      this.selectedAttachments.push(attachment);
    }
  }

  attachmentRemoved(attachment: any) {
    _.remove(this.selectedAttachments, (item: any) => {
      return item.name === attachment.name;
    });
  }

  sendMessage() {
    this.messageChange.emit({
      newMessage: this.validateMessage(this.newMessage),
      selectedAttachments: this.selectedAttachments,
    });
    this.newMessage = '';
    this.selectedAttachments = [];
  }

  validateMessage(message: string) {
    return message.replace(URL_PATTERN, function (url) {
      return (
        '<span class="custom-link" style="color: var(--ion-color-primary, #3880ff)!important;text-decoration: underline!important;"><a href="' +
        url +
        '" target="_blank">' +
        url +
        '</a></span>'
      );
    });
  }


  onEmojiChange(emoji: any) {
    this.newMessage = this.newMessage.concat(emoji.char || '');
  }

  removeReplies() {
    this.removeReply.emit(true);
  }

  toggleEmojiVisibility(visible: boolean) {
    this.isEmojiVisible = visible;
  }
}
