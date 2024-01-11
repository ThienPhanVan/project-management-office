import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { ConnectPageRoutingModule } from '../connect-routing.module';
import { AlertDialog, IEmoji, Message } from '../../interface';
import { MasterDataService } from '../../shared/services';
import { ConversationService } from 'src/app/services/conversation.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageUpdateService } from 'src/app/shared/services/message.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPageRoutingModule,
    SharedModule,
  ],
  selector: 'app-message-action-list',
  templateUrl: './message-action-list.component.html',
  styleUrls: ['./message-action-list.component.scss'],
})
export class MessageActionListComponent implements OnInit {
  @Output() onDelete: EventEmitter<string> = new EventEmitter<string>();
  @Input() message!: Message;
  isEmojiVisible: boolean = true;
  @Input() group: any;
  @Output() onEmojiChange: EventEmitter<Message> = new EventEmitter<Message>();
  
  ngOnInit() {
    // this.route.paramMap.subscribe((params) => {
    //   this.groupId = params.get('groupId') ?? ''; 
    // });
    // console.log('ngOnInit in app-message-action-list');
    // console.log('groupId in app-message-action-list:', this.group);
  }
  
 

  isOpen: boolean = false;
  emojis: any = [
    {
      codes: '1F64C',
      char: '🙌',
      name: 'raising hands',
      category: 'People & Body (hands)',
      group: 'People & Body',
      subgroup: 'hands',
    },
    {
      codes: '1F440',
      char: '👀',
      name: 'eyes',
      category: 'People & Body (body-parts)',
      group: 'People & Body',
      subgroup: 'body-parts',
    },
    {
      codes: '1F495',
      char: '💕',
      name: 'two hearts',
      category: 'Smileys & Emotion (heart)',
      group: 'Smileys & Emotion',
      subgroup: 'heart',
    },
    {
      codes: '2705',
      char: '✅',
      name: 'check mark button',
      category: 'Symbols (other-symbol)',
      group: 'Symbols',
      subgroup: 'other-symbol',
    },
    {
      codes: '1F923',
      char: '🤣',
      name: 'rolling on the floor laughing',
      category: 'Smileys & Emotion (face-smiling)',
      group: 'Smileys & Emotion',
      subgroup: 'face-smiling',
    },
  ];

  @Output() onReactions: EventEmitter<{
    message_id: string;
    react_emoji: string;
  }> = new EventEmitter<{ message_id: string; react_emoji: string }>();

  @Output() emojiSelected: EventEmitter<string> = new EventEmitter<string>();

  reactions(react_emoji: string) {
    this.isOpen = false;
    const data = {
      message_id: this.message.id,
      react_emoji: react_emoji,
    };
    this.onReactions.emit(data);
  }

  emojiChanged(message: Message, emojiSelect: IEmoji) {
    if (!message.message_reactions) {
      message.message_reactions = [];
    }
  
    const data = {
      message_id: message.id,
      react_emoji: emojiSelect?.char,
    };
  
    this.conversationService.reactionMessage(data).subscribe(
      (res) => {
        if (Array.isArray(message.message_reactions)) {
          message.message_reactions.push({
            react_emoji: emojiSelect?.char
          });
        }
        this.onEmojiChange.emit(message);
      }
    );
  }
  

  constructor(
    private masterDataService: MasterDataService,
    private conversationService: ConversationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private messageService: MessageUpdateService,
    private alertController: AlertController
  ) {}

  close() {
    this.isOpen = false;
  }

  open(message: any) {
    this.isOpen = true;
    this.message = message;
  }

  getMyId() {
    return this.masterDataService.meBus$.value?.id || '';
  }

  toggleEmojiVisibility(visible: boolean) {
    this.isEmojiVisible = visible;
  }

  deleteMessage() {
    this.isOpen = false;
    const sendMessageRequest: Message = {
      id: this.message.id,
      description: this.translate.instant('TAB.MESSAGE.UNSEND_MESSAGE'),
      message_group_id: this.group.id,
      images: []
    };
  
    this.conversationService.editMessage(this.message.id, sendMessageRequest)
      .subscribe(
        (res) => {
          this.onDelete.emit(res);
        },
        (error) => {
          let alertDialog = {
            header: this.translate.instant('NOTIFICATION.HEADER'),
            message: this.translate.instant('TAB.MESSAGE.DELETE_MESSAGE_ADMIN'),
            buttons: [
              {
                text: 'OK',
                role: 'confirm',
              },
            ],
          };
          this.presentAlert(alertDialog);
        }
      );
  }

  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }

  pinMessage() {
    this.isOpen = false;
    const data = {
      message_id: this.message.id,
      message_group_id: this.group.id,
    };
    this.conversationService.pinMessage(data).subscribe((res) => {});
  }

  editMessage() {
    this.isOpen = false;
    if(this.message && this.message.description && this.message.description !== this.translate.instant('TAB.MESSAGE.UNSEND_MESSAGE')){
      this.messageService.updateMessage(this.message);
    }
  }
}
