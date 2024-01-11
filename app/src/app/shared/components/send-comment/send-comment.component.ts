import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { IAttachment } from '../../../interface';
import * as _ from 'lodash';
import * as standardEmojis from '../../../../assets/emoji/standard-emoji.json';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services';
import { ViewChild, ElementRef } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { convertToLink } from '../../../constant/index';

@Component({
  selector: 'app-send-comment',
  templateUrl: './send-comment.component.html',
  styleUrls: ['./send-comment.component.scss'],
})
export class SendCommentComponent implements OnInit, OnChanges {
  @Input() replies: any;
  @Input() message: string = '';
  @Input() data: any;

  @Output() messageChange = new EventEmitter();
  @Output() removeReply = new EventEmitter();
  @Output() uploadImage = new EventEmitter();

  @ViewChild('inputComment') inputComment!: ElementRef;

  messageEmit: string = '';
  displayMessage: string = '';
  selectedAttachments: IAttachment[] = [];
  emojiGroups: any = [];
  isDisable: boolean = true;
  isShowMention: boolean = false;
  computedHeight: number = 0;
  user = JSON.parse(localStorage.getItem('user') || '{}');
  placeholder: string = this.translate.instant('TAB.HOME.WRITE_COMMENT');

  offset: number = 0;
  limit: number = 10;
  count: number = 0;
  query: any;
  mentions: any[] = [];
  chooseMentions: any[] = [];
  choseMentionIds: any = [];
  searchUser: string = '';
  index: number = 0;
  messEmit: string = '';

  constructor(
    private translate: TranslateService,
    private router: Router,
    private userService: UserService,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.getEmojisGroup();
  }
  getEmojisGroup() {
    this.emojiGroups = _(standardEmojis)
      .groupBy((x) => x.group)
      .map((emojis, group) => ({
        group,
        emojis,
      }))
      .value();
  }

  ngOnChanges(samples: any) {
    if (this.message !== '') {
      this.displayMessage = this.message;
    }
  }
  onChange(ev: any) {
    this.messEmit = ev.target.value.trim();
    console.log(this.messEmit);
    if (this.messEmit !== '') {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
    const regex = /https?:\/\/\S+/;
    let checkMention = ev.target.value.replace(regex, '').trim();
    if (checkMention.includes('@')) {
      this.isShowMention = true;
      let indexCheckMention = checkMention.indexOf('@');
      this.searchUser = checkMention.substring(indexCheckMention + 1);
      this.onSearchQuery(this.searchUser);
      if (this.searchUser === '') {
        this.index = this.messEmit.length - 1;
      } else {
        this.index =
          this.messEmit.indexOf(checkMention.substring(indexCheckMention + 1)) -
          1;
      }
    } else {
      this.isShowMention = false;
      this.displayMessage = this.messEmit;
      this.emojiGroups.forEach((groups: any) => {
        groups.emojis.find((element: any) => {
          if (this.messEmit.includes(element.char)) {
            this.messEmit = this.messEmit.replace(
              element.char,
              `${element.codes}`
            );
          }
        });
      });

      this.chooseMentions.forEach((item: any) => {
        if (
          this.messEmit
            .replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
            .includes(item.username)
        ) {
          this.messEmit = this.messEmit.replace(
            item.username,
            `<a class="text-blue-600 ${item?.id}"> ${item?.username} </a>`
          );
        }
      });

      this.messageEmit = convertToLink(this.messEmit);
    }
  }

  attachmentSelected(attachment: any) {
    if (attachment) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
    if (_.findIndex(this.selectedAttachments, attachment) === -1) {
      this.uploadImage.emit(attachment);
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
      newMessage: this.messageEmit,
      images: this.images,
      mentions: this.choseMentionIds,
    });
    this.messageEmit = '';
    this.displayMessage = '';
    this.images = [];
    this.choseMentionIds = [];
    this.selectedAttachments = [];
  }

  // validateMessage(message: string) {
  //   return message.replace(URL_PATTERN, function (url) {
  //     return (
  //       '<span style="color: var(--ion-color-primary, #3880ff)!important;text-decoration: underline!important;" (click)="$event.stopPropagation()"><a href="' +
  //       url +
  //       '" target="_blank">' +
  //       url +
  //       '</a></span>'
  //     );
  //   });
  // }

  redirectUser(id: string) {
    this.router.navigate([`/tabs/users/${id}`]);
  }

  onEmojiChange(emoji: any) {
    if (emoji) {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
    this.displayMessage = this.displayMessage ?? '';
    this.messageEmit = this.messageEmit ?? '';

    this.displayMessage = this.displayMessage.concat(` ${emoji.char} `);
    this.messageEmit = this.messageEmit.concat(` ${emoji.codes} `);
  }

  removeReplies() {
    this.removeReply.emit(true);
  }

  //show modal mention
  setOpen(ev: any) {
    this.isShowMention = ev;
  }

  //search mention
  onSearchQuery(q: string) {
    let querySearch = `%${q}%`;
    this.userService.searchUsers(querySearch).subscribe((res: any) => {
      if (res && res.data) {
        this.mentions = res.data;
      }
    });
  }

  //choose mention
  chooseMention(data: any) {
    this.chooseMentions.push(data);
    this.choseMentionIds.push(data.id);
    this.displayMessage =
      this.displayMessage.substring(0, this.index) + `${data.username}`;
    this.messEmit = this.displayMessage;
    this.emojiGroups.forEach((groups: any) => {
      groups.emojis.find((element: any) => {
        if (this.messEmit.includes(element.char)) {
          this.messEmit = this.messEmit.replace(
            element.char,
            `${element.codes}`
          );
        }
      });
    });

    this.chooseMentions.forEach((item: any) => {
      if (
        this.messEmit
          .replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
          .includes(item.username)
      ) {
        this.messEmit = this.messEmit.replace(
          item.username,
          `<a class="text-blue-600 ${item?.id}"> ${item?.username} </a>`
        );
      } else {
        this.choseMentionIds = this.choseMentionIds.filter(
          (id: any) => id !== item.id
        );
      }
    });

    this.messageEmit = this.messEmit;
    this.inputComment?.nativeElement.focus();
    this.isShowMention = false;
  }

  images: any = [];
  //add image for array
  async handleAddImageComment(event: any) {
    this.isDisable = true;

    let dataImages: any = [];
    if (dataImages.length === 0) {
      dataImages.push({
        name: '',
        image_url: '',
        description: '',
        resource_type: 'comments',
        resource_id: this.data.id ? this.data.id : null,
      });
    }

    if (!event.target.files[0] || event.target.files[0].length == 0) {
      return;
    }

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) !== null) {
      await this.newsService
        .onFileSelected(event.target.files[0], new Date().getDate())
        .subscribe((res: any) => {
          if (res.body && res.body.Location) {
            dataImages[0] = {
              name: res.body.Key,
              image_url: res.body.Location,
              description: res.body.key,
              resource_type: 'comment',
              resource_id: this.data.id ? this.data.id : null,
            };
          }
          this.isDisable = false;
        });
      this.images = dataImages;
    }
  }

  //remove image in array
  handleRemoveImage() {
    this.images = [];
  }
}
