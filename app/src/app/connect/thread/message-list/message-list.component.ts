import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAttachment } from '../../../interface';

interface User {
  id: string;
  username: string;
}

@Component({
  selector: 'app-message-list-thread',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListThreadComponent  implements OnInit {
  @Input() messages: any = [];
  @Output() imageClicked = new EventEmitter();

  constructor(
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  onImageClicked(image: IAttachment) {
    this.imageClicked.emit(image);
  }

  user!: User;
}
