import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import { THUMBNAIL_URL } from '../../../constant';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() images: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('slickModal')
  slickModal: SlickCarouselComponent | undefined;
  activeSlider: number = 0;
  isActiveImage: boolean = false;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    dots: true,
  };

  constructor() {}

  ngOnInit(): void {
    this.activeSlider = this.images.index;
  }

  //check active slider after open modal
  ngAfterViewChecked() {
    if (this.isActiveImage) {
      this.slickModal?.slickGoTo(this.images.index);
      this.isActiveImage = false;
    }
  }

  //init slick slider
  slickInit() {
    this.isActiveImage = true;
  }

  //after change slider
  afterChange(e: any) {
    this.activeSlider = e.currentSlide;
  }

  //close modal
  hideModal() {
    this.images.index = 0;
    this.closeModal.emit(false);
  }
}
