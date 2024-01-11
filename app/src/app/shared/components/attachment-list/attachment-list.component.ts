import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IAttachment } from '../../../interface';
import * as _ from 'lodash';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss'],
})
export class AttachmentListComponent implements OnInit {
  @Input() attachments: IAttachment[] = [];
  @Output() onImageClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  getImages() {
    return _.filter(this.attachments, (attachment: IAttachment) => {
      return attachment.type === 'image';
    });
  }

  imageClicked(event: any) {
    this.onImageClicked.emit(event);
  }

  download() {}

  play(videoElement: HTMLVideoElement) {
    videoElement.paused ? videoElement.play() : videoElement.pause();  }
}
