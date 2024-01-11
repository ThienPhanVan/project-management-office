import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-tag-name-list',
  templateUrl: './tag-name-list.component.html',
  styleUrls: ['./tag-name-list.component.scss'],
})
export class TagNameListComponent implements OnInit {
  // @Input() arrayIdMentions: any;
  @Input() title: string = '';
  @Input() data: any;
  @Input() count: number = 0;
  @Input() isLoading: boolean = false;
  @Input() mentions: any[] = [];

  // @Input() arrayMention: string[] = [];
  @Output() getArrayMention: EventEmitter<Array<string>> = new EventEmitter();
  // @Output() chooseData = new EventEmitter();
  @Output() searchQuery = new EventEmitter();
  @Output() query = new EventEmitter();

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  searchUser: string = '';
  limit: number = 10;
  offset: number = 0;

  isModalOpen = false;
  isScroll: boolean = true;
  isChoice = false;

  constructor() {}

  ngOnInit() {
    // console.log(this.mentions);
    // if (this.arrayIdMentions) {
    //   let data: any[] = [];
    //   this.arrayIdMentions.forEach((mentionId: string) => {
    //     this.data.find((el: any) => {
    //       if (mentionId === el.id) {
    //         el.isSelected = true;
    //         data.push(el);
    //       }
    //     });
    //   });
    //   this.mentions = data;
    // }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.data.forEach((el: any) => {
      this.mentions.forEach((mention: any) => {
        if (el.id === mention.id) el.isSelected = true;
      });
    });
  }

  //choose id
  ionChangeMention(id: string, checked: boolean) {
    console.log(checked);

    this.data.forEach((el: any) => {
      if (el.id === id) el.isSelected = checked;
    });

    const filterSelected = this.data.filter(
      (el: any) => el.isSelected === true
    );

    this.mentions = filterSelected;
  }

  //choose Id and close modal
  confirmChanges() {
    if (this.mentions.length) {
      const dataName = this.mentions.map((el) => {
        return el.id;
      });
      this.getArrayMention.emit(dataName);
    }

    this.isModalOpen = false;
  }

  //close modal
  cancelChanges() {
    this.isModalOpen = false;
    this.searchQuery.emit('');
  }

  //search data
  handleSearch(event: any) {
    this.searchUser = event.target.value.toLowerCase();
    this.searchQuery.emit(event.target.value.toLowerCase());
  }

  // onSearchChange(event: any) {
  //   // this.mention = event.target.value;
  // }

  // eventHandler(keyCode: number) {
  //   if (keyCode === 13) {
  //     // this.arrayMention.push(this.mention);
  //     // this.mention = '';
  //     // this.ionInputEl.value = '';
  //     // this.getArrayMention.emit(this.arrayMention);
  //   }
  // }

  loadMentions(event: any) {
    if (this.count > this.limit) {
      this.isScroll = true;
      this.offset += 10;

      this.query.emit({
        offset: this.offset,
        limit: this.limit,
        q: this.searchUser ? `%${this.searchUser}%` : '',
      });
      this.data.forEach((el: any) => {
        this.mentions.forEach((mention: any) => {
          if (el.id === mention.id) el.isSelected = true;
        });
      });
      event.target.complete();
    } else {
      this.isScroll = false;
    }
  }

  removeMention(mention: any) {
    this.mentions = this.mentions.filter((item) => item.id !== mention.id);

    const index = this.data.findIndex((item: any) => item.id === mention.id);
    if (index !== -1) {
      this.data[index].isSelected = false;
    }
    this.getArrayMention.emit(this.mentions);
  }
}
