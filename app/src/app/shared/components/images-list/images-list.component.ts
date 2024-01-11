import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { THUMBNAIL_URL } from 'src/app/constant';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.scss'],
})
export class ImagesListComponent implements OnInit {
  @Input() images: any;
  @Output() zoom = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  //zoom image
  clickZoom(index: number, data: any) {
    this.zoom.emit({ index, data });
  }
  //error image
  onError(item: any) {
    if (item?.image_url) return (item.image_url = THUMBNAIL_URL);
    else return THUMBNAIL_URL;
  }
}
