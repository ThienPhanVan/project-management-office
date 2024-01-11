import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { THUMBNAIL_URL } from '../../../constant';

@Component({
   selector: 'app-preview-video',
   templateUrl: './preview-video.component.html',
   styleUrls: ['./preview-video.component.scss'],
 })
export class PreviewVideoComponent implements OnInit {
  @Input() video: string = '';
  @Input() showModal: boolean = false;
  @Input() indexCurrent: any;
  @Input() dataImage: any = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {
   console.log('call')
  }

  hideModal() {
    this.closeModal.emit(false);
  }

  onError(thumbnail: string) {
    return (thumbnail = THUMBNAIL_URL);
  }

}
