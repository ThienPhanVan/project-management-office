import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { THUMBNAIL_URL } from '../../../constant';
import { Location } from '@angular/common';
import { IdIndexImageEmit } from '../../../interface/news.interface';

@Component({
  selector: 'app-commerce-list',
  templateUrl: './commerce-list.component.html',
  styleUrls: ['./commerce-list.component.scss'],
})
export class CommerceListComponent implements OnInit {
  @Input() data: any = [];
  @Input() isLoading: boolean = true;
  @Output() getIndexArrayImage: EventEmitter<IdIndexImageEmit> =
    new EventEmitter();
  @Output() heart = new EventEmitter();

  isShowListUser: boolean = false;
  isBackground: boolean = true;
  SkeletonData = [1, 2, 3];

  constructor(private location: Location) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  //thả tim
  onHeart(id: string) {
    this.heart.emit(id);
  }

  getIndexArrayImages(object: IdIndexImageEmit) {
    this.getIndexArrayImage.emit(object);
  }

  //copy-link
  onCopy(value: any) {}
}
