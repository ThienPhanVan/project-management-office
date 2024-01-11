import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NewsDataService } from '../../services/news-data.service';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss'],
})
export class NewsItemComponent implements OnInit {
  @Input() me: any;
  @Input() indexNews: any = 0;
  @Input() data: any;
  @Input() isLoading: boolean = false;
  @Input() hostNameLocation: string = '';

  @Output() heart: EventEmitter<string> = new EventEmitter();
  @Output() modalUsers: EventEmitter<boolean> = new EventEmitter();
  @Output() tagSearch = new EventEmitter();
  @Output() hidden = new EventEmitter();
  @Output() undo = new EventEmitter();
  @Output() actionSheet = new EventEmitter();
  @Output() zoomImage = new EventEmitter();

  isAvatar: boolean = true;
  isOrg: boolean = false;
  idForData: string = '';
  isShowListUser: boolean = false;
  // isModalOpen = false;
  mentionOthers: any[] = [];
  isShowMore: boolean = false;

  constructor(
    private route: Router,
    private newsDataService: NewsDataService
  ) {}

  ngOnInit(): void {
    if (this.data?.organization) {
      this.isOrg = true;
    }

    if (this.data?.mentions?.length > 2) {
      this.mentionOthers = this.data?.mentions?.filter(
        (mention: any) => mention.id !== this.data?.mentions[0].id
      );
    }
  }

  //thả tim
  onHeart(id: string) {
    this.heart.emit(id);
  }

  //show modal list user react
  setOpen(value: boolean) {
    this.isShowListUser = value;
  }

  //search tag
  handleShowSearchTag(value: string) {
    this.tagSearch.emit(value);
  }

  //redirect detail with comment
  clickRedirectDetail(ev: any) {
    this.newsDataService.setNewDetail(this.data);

    this.route.navigate([`/tabs/news/${this.data.id}`]);
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

  //zoom
  onZoom(data: { index: number; data: any }) {
    this.zoomImage.emit(data);
  }
}
