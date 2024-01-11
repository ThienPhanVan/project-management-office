import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-hashtag-mention',
  templateUrl: './hashtag-mention.component.html',
  styleUrls: ['./hashtag-mention.component.scss'],
})
export class HashtagMentionComponent implements OnInit {
  @Input() arrayHashtag: string[] = [];

  @Output() getArrayHashtag: EventEmitter<Array<string>> = new EventEmitter();
  @Output() getHashtag: EventEmitter<string> = new EventEmitter();

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  hashtag: string = '';

  constructor() {}

  ngOnInit(): void {
    // console.log(this.arrayHashtag);
  }

  onSearchChange(event: any) {
    let str = event.target.value;
    this.hashtag = str.replace(/ /g, '').replace(/#/g, '');
    this.getHashtag.emit(this.hashtag);
  }

  eventHandler(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
    // console.log(keyCode);
    if (event.keyCode === 13) {
      if (!this.arrayHashtag.includes(this.hashtag)) {
        this.arrayHashtag.push(this.hashtag);
      }

      this.hashtag = '';
      this.ionInputEl.value = '';
      this.getHashtag.emit(this.hashtag);
      this.getArrayHashtag.emit(this.arrayHashtag);
      // this.element.nativeElement.value = "";
    }
  }

  removeHashtag(index: number) {
    this.arrayHashtag.splice(index, 1);

    this.getArrayHashtag.emit(this.arrayHashtag);
  }
}
