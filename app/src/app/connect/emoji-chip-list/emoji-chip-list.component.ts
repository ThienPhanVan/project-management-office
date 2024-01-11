import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { ConnectPageRoutingModule } from '../connect-routing.module';
import { Input } from '@angular/core';
import { IEmoji, IEmojiGroup, IEmojiUsers } from '../../interface';
import * as _ from 'lodash';
import { MasterDataService } from '../../shared/services';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectPageRoutingModule,
    SharedModule,
  ],
  selector: 'app-emoji-chip-list',
  templateUrl: './emoji-chip-list.component.html',
  styleUrls: ['./emoji-chip-list.component.scss'],
})
export class EmojiChipListComponent implements OnInit, OnChanges {
  @Input() emojiUsers: IEmojiUsers[] = [];
  @Output() onEmojiUnselect = new EventEmitter();

  duplicateEmojiGroups: IEmojiGroup[] = [];

  constructor(private masterDataService: MasterDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('emojiUsers')) {
      this.updateEmojiGroups();
    }
  }

  ngOnInit() {}

  updateEmojiGroups() {
    const emojiCount = this.emojiUsers.reduce((result: any, item) => {
      const emoji = item.emoji;
      if (!result.hasOwnProperty(emoji.codes)) {
        result[emoji.codes] = item.user_ids;
      } else {
        result[emoji.codes] = [...result[emoji.codes], ...item.user_ids];
      }
      return result;
    }, {});

    this.duplicateEmojiGroups = _.keys(emojiCount).map((k) => {
      return {
        codes: k,
        count: emojiCount[k].length,
        char: this.getEmojiUsersByCodes(k)?.emoji.char || '',
        user_ids: emojiCount[k],
      };
    });
  }

  getEmojiUsersByCodes(codes: string) {
    return _.find(this.emojiUsers, (item) => {
      return item.emoji.codes === codes;
    });
  }

  getMyId(): string {
    return this.masterDataService.meBus$.value?.id || '';
  }

  isMyIdInGroup(group: IEmojiGroup) {
    if (group.user_ids) {
      return _.includes(group.user_ids, this.getMyId());
    }
    return true;
  }

  unselectEmoji(group: IEmojiGroup) {
    if (this.isMyIdInGroup(group)) {
      this.emojiUsers = _.filter(this.emojiUsers, (item) => {
        return !(
          item.emoji.codes === group.codes &&
          _.includes(item.user_ids, this.getMyId())
        );
      });
      this.onEmojiUnselect.emit(this.emojiUsers)
      this.updateEmojiGroups();
    }
  }
}
