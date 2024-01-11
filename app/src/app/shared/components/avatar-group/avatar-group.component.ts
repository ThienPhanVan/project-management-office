import { Component, Input, OnInit } from '@angular/core';
import { THUMBNAIL_URL } from '../../../constant';

@Component({
  selector: 'app-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
})
export class AvatarGroupComponent  implements OnInit {
  @Input() avatarShowNumber: number = 3;
  @Input() data: any = [];

  avatarUrlDefault: string = THUMBNAIL_URL
  constructor() {
  }

  ngOnInit() {}

  filterAvatars() {
    if(this.data?.length <= this.avatarShowNumber){
      return this.data
    }
    return this.data.slice(0, this.avatarShowNumber)
  }

}
