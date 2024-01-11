import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-categories-slide',
  templateUrl: './categories-slide.component.html',
  styleUrls: ['./categories-slide.component.scss'],
})
export class CategoriesSlideComponent implements OnInit {
  @Input() categories: any;
  @Input() productCategoryId: string = '';

  @Input() isLoading: boolean = false;
  @Input() isShowFilter: boolean = true;
  @Output() active = new EventEmitter();
  @Output() segment = new EventEmitter();
  @Output() isOpenModalFilter = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  activeCategory(ev: any) {
    this.active.emit(ev);
  }

  changeSegment(ev: any) {
    this.segment.emit(ev);
  }

  setOpenModalFilter() {
    this.isOpenModalFilter.emit(true);
  }
}
