import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import * as _ from 'lodash';
import {
  THUMBNAIL_URL,
  COVER_URL,
  GROUP_THUMBNAIL_URL,
} from '../../../constant';
import {
  IdIndexImageEmit,
  UploadImage,
} from '../../../interface/news.interface';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() data: any = {};
  @Input() form: any;
  @Input() type: string = '';

  @Input() classNameAvatar: string = '';
  @Input() classNameThumbnail: string = '';

  @Input() updateAvatar: boolean = false;
  @Input() isUploadImage: boolean = false;
  @Input() isAvatar: boolean = false;
  @Input() isParticipate: boolean = false;

  @Input() isBackground: boolean = false;
  @Input() isUploadImageBg: boolean = false;
  @Input() isLogo: boolean = false;
  @Input() isUploadImageLogo: boolean = false;
  // @Input() listImages: {id: number, src: string}[] = []
  @Input() isEdit: boolean = false;
  @Input() isCreate: boolean = false;
  @Input() isLoadingUpload: boolean = false;
  @Input() isGroupAvatar: boolean = false;
  @Input() isOnline: boolean = false;

  @Output() setCoverImageEvent: EventEmitter<any> = new EventEmitter();
  @Output() setCoverImageBackgroundEvent: EventEmitter<any> =
    new EventEmitter();
  @Output() setThumbnailLogoEvent: EventEmitter<any> = new EventEmitter();
  @Output() getSrcImage: EventEmitter<string> = new EventEmitter();
  @Output() getIndexArrayImage: EventEmitter<IdIndexImageEmit> =
    new EventEmitter();
  @Output() removeImage: EventEmitter<IdIndexImageEmit> = new EventEmitter();
  @Output() addImage: EventEmitter<UploadImage> = new EventEmitter();

  isAvatarOrg: boolean = false;

  newListImage: any[] = [];
  // zoomDataImage: IdIndexImageEmit = {
  //   id: 0,
  //   index: 0,
  // };
  removeDataImage: IdIndexImageEmit = {
    id: 0,
    index: 0,
  };

  constructor() {}

  ngOnInit() {
    // if (this.data?.organization) {
    //   this.isAvatarOrg = true;
    // }
    if(this.data?.is_group === 1) {
      this.data.thumbnail = GROUP_THUMBNAIL_URL
    }

    if (this.data?.thumbnail === null) {
      this.data.thumbnail = THUMBNAIL_URL;
    }

    if (this.data?.cover === null) {
      this.data.cover = COVER_URL;
    }
  }

  //update image
  setCoverImage(event: any) {
    this.setCoverImageEvent.emit(event);
  }

  setCoverImageBackground(event: any) {
    this.setCoverImageBackgroundEvent.emit(event);
  }

  setThumbnailLogo(event: any) {
    this.setThumbnailLogoEvent.emit(event);
  }

  onError(data: any) {
    if (data?.thumbnail === null || data?.thumbnail === '') {
      return (data.thumbnail = THUMBNAIL_URL);
    } else if (data?.cover) return (data.cover = THUMBNAIL_URL);
    else return THUMBNAIL_URL;
  }

  // zoomImage(thumbnail: string) {
  //   this.getSrcImage.emit(thumbnail);
  // }

  // zoomArrayImage(index: number) {
  //   this.zoomDataImage = {
  //     id: this.data.id,
  //     index,
  //   };
  //   this.getIndexArrayImage.emit(this.zoomDataImage);
  // }

  handleRemoveImage(index: number) {
    this.removeDataImage = {
      id: this.data.id,
      index,
    };
    this.removeImage.emit(this.removeDataImage);
  }

  handleUpload(event: any) {
    this.addImage.emit(event);
  }
}
