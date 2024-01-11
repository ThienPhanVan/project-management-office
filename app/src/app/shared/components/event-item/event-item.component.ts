import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';
import { THUMBNAIL_URL } from 'src/app/constant';
import { NewsDataService } from '../../services';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
})
export class EventItemComponent implements OnInit {
  @Input() indexNews: any;
  @Input() me: any;
  @Input() data: any;
  @Input() hostNameLocation: string = '';
  @Input() isLoading: boolean = false;

  @Output() willParticipate: EventEmitter<any> = new EventEmitter();
  @Output() heart: EventEmitter<string> = new EventEmitter();
  @Output() hidden = new EventEmitter();
  @Output() undo = new EventEmitter();
  @Output() actionSheet = new EventEmitter();
  @Output() tagSearch = new EventEmitter();
  @Output() zoomImage = new EventEmitter();

  isBackground: boolean = true;
  isOrg: boolean = false;
  // imagesString: string = '';
  showModal: boolean = false;

  constructor(
    private route: Router,
    private newsDataService: NewsDataService
  ) {}

  ngOnInit(): void {
    if (this.data?.organization) {
      this.isOrg = true;
    }
  }

  onError(item: any) {
    return (item.thumbnail = THUMBNAIL_URL);
  }

  onWillParticipate(data: any) {
    this.willParticipate.emit(data);
  }

  //thả tim
  onHeart(id: string) {
    this.heart.emit(id);
  }

  handleEventChild(children: any) {
    localStorage.setItem('children-active', children.id);
    this.route.navigate([`tabs/events/${children.id}`]);
  }

  clickRedirectDetail(ev: any) {
    localStorage.setItem('isComment', 'true');
    this.newsDataService.setNewDetail(this.data);
    this.route.navigate([`/tabs/events/${this.data.id}`]);
  }

  //action sheet
  setResult(data: any) {
    this.actionSheet.emit(data);
  }

  //hide news
  handleHidden(data: any) {
    this.hidden.emit(data);
  }

  handleUndo(id: string) {
    this.undo.emit(id);
  }

  //search tag
  handleShowSearchTag(value: string) {
    this.tagSearch.emit(value);
  }

  //zoom
  onZoom(index: number, cover: string) {
    const data: { index: number; data: any } = {
      index,
      data: [...this.data.images],
    };
    this.zoomImage.emit(data);
  }
}
