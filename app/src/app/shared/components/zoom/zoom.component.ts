import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { THUMBNAIL_URL } from '../../../constant';

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements OnInit {
  @Input() image: string = '';
  @Input() showModal: boolean = false;
  @Input() indexCurrent: any;
  @Input() dataImage: any = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    if (
      (this.image === null && this.dataImage.length === 0) ||
      (this.image === '' && this.dataImage.length === 0)
    ) {
      this.image = THUMBNAIL_URL;
    }
  }

  hideModal() {
    this.closeModal.emit(false);
  }

  onError(thumbnail: string) {
    return (thumbnail = THUMBNAIL_URL);
  }

  actionImage(index: number) {
    let newClick = this.indexCurrent;
    newClick += index;

    if (newClick <= 0) newClick = 0;
    else if (newClick >= this.dataImage.length - 1)
      newClick = this.dataImage.length - 1;

    return (this.indexCurrent = newClick);
  }
}
