import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as standardEmojis from '../../../../assets/emoji/standard-emoji.json';
import * as _ from 'lodash';

@Component({
  selector: 'app-emoji-select',
  templateUrl: './emoji-select.component.html',
  styleUrls: ['./emoji-select.component.scss'],
})
export class EmojiSelectComponent implements OnInit {
  @Output() onEmojiChange = new EventEmitter<any>();

  isOpen: boolean = false;
  emojiGroups: any = [];
  emojiGroupsIcons = [
    'time-outline',
    'happy-outline',
    'body-outline',
    'leaf-outline',
    'fast-food-outline',
    'airplane-outline',
    'basketball-outline',
    'shirt-outline',
    'text-outline',
    'flag-outline',
  ];

  constructor() {}

  ngOnInit() {
    this.emojiValidator();
    this.hightlightButton();
  }

  close() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  emojiValidator() {
    this.emojiGroups = _(standardEmojis)
      .groupBy((x) => x.group)
      .map((emojis, group) => ({
        group,
        emojis,
      }))
      .value();
  }

  scrollIntoGroup(groupIndex: string) {
    const element = document.getElementById('icon-group-' + groupIndex);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  hightlightButton() {
    // const button = document.querySelector('button' + groupIndex);
    // const groupIcon = document.getElementById(groupIndex);
    // if(groupIcon && button){
    //   window.addEventListener('scroll', () => {
    //     const scrollTop = window.scrollY;
    //     const elementTop = groupIcon.offsetTop;
    //     const elementHeight = groupIcon.offsetHeight;
    //     if (scrollTop >= elementTop && scrollTop < elementTop + elementHeight) {
    //       button.classList.add('active');
    //     } else {
    //       button.classList.remove('active');
    //     }
    //   });
    // }
  }

  emojiChange(emoji: any) {
    this.onEmojiChange.emit(emoji);
  }
}
