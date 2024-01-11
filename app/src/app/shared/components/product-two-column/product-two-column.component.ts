import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { THUMBNAIL_URL, COVER_URL } from 'src/app/constant';
import { CommerceDataService } from '../../services/commerce-data.service';

@Component({
  selector: 'app-product-two-column',
  templateUrl: './product-two-column.component.html',
  styleUrls: ['./product-two-column.component.scss'],
})
export class ProductTwoColumnComponent implements OnInit {
  @Input() data: any = [];
  @Input() me: any;
  @Input() isLoading: boolean = true;
  @Output() zoomImage = new EventEmitter();
  @Output() heart = new EventEmitter();
  @Output() actionSheet = new EventEmitter();
  @Output() hidden = new EventEmitter();
  @Output() undo = new EventEmitter();

  isShowListUser: boolean = false;
  isBackground: boolean = true;
  isHiddenSummary: boolean = true;
  defaultImage: string = THUMBNAIL_URL;
  defaultCover: string = COVER_URL;
  SkeletonData = [1, 2, 3];

  constructor(
    private route: Router,
    private translate: TranslateService,
    private commerceDataService: CommerceDataService
  ) {}
  public actionSheetGuests = [
    {
      text: this.translate.instant('BUTTON.REPORT'),
      role: 'report',
      data: {
        action: 'report',
      },
    },
    {
      text: this.translate.instant('BUTTON.FOLLOW'),
      role: 'follow',
      data: {
        action: 'follow',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  public actionSheetOwn = [
    // {
    //   text: this.translate.instant('BUTTON.REPORT'),
    //   role: 'report',
    //   data: {
    //     action: 'report',
    //   },
    // },
    // {
    //   text: this.translate.instant('BUTTON.FOLLOW'),
    //   role: 'follow',
    //   data: {
    //     action: 'follow',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.UPDATE'),
      role: 'edit',
      data: {
        action: 'edit',
      },
    },
    // {
    //   text: this.translate.instant('BUTTON.UPLOAD_IMAGE'),
    //   role: 'upload',
    //   data: {
    //     action: 'upload',
    //   },
    // },
    {
      text: this.translate.instant('BUTTON.DELETE'),
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: this.translate.instant('BUTTON.CANCEL'),
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  ngOnInit(): void {}

  //thả tim
  onHeart(id: string) {
    this.heart.emit(id);
  }

  //zoom
  onZoom(data: { index: number; data: any }) {
    this.zoomImage.emit(data);
  }

  directProductDetail(data: any) {
    this.commerceDataService.setProductDetail(data);
    this.route.navigate([`/tabs/commerces/${data.id}`]);
  }

  clickRedirectDetail(id: any) {
    this.data.forEach((item: any) => {
      if (item.id === id) {
        this.commerceDataService.setProductDetail(item);
      }
    });
    this.route.navigate([`/tabs/commerces/${id}`]);
  }

  //action sheet
  setResult(ev: any, data: any) {
    const event = ev?.detail?.data?.action;
    this.actionSheet.emit({ event, data });
  }

  //hide news
  handleHidden(data: any) {
    this.hidden.emit(data);
  }

  handleUndo(id: string) {
    this.undo.emit(id);
  }

  onError(item: any, field: string) {
    return (item[field] = THUMBNAIL_URL);
  }
}
