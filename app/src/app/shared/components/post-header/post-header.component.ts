import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { type } from 'os';
import * as feelings from 'src/assets/emoji/feelings.json';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent implements OnInit {
  @Input() me: any;
  @Input() data: any;
  @Input() indexNews: any = 0;
  @Input() isLoading: boolean = true;

  @Input() mentionOthers: any[] = [];
  isOrg: boolean = false;
  isShowListUser: boolean = false;

  @Output() actionSheet = new EventEmitter();
  @Output() hidden = new EventEmitter();

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

  public actionSheetSuperAdmin = [
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

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    if (this.data.feeling) {
      this.data = {
        ...this.data,
        feeling:
          this.translate.instant(
            this.data.feeling.substring(0, this.data.feeling.indexOf('-'))
          ) +
          ' ' +
          this.data.feeling.substring(this.data.feeling.indexOf('-') + 1),
      };
    }
    if (!this.me) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.me = JSON.parse(userStr);
      }
    }
  }

  //action sheet
  setResult(ev: any, data: any) {
    const event = ev?.detail?.data?.action;
    if (data.type === 0) {
      this.actionSheet.emit({ event, data, type: 'opportunities' });
    } else if (data.type === 1) {
      this.actionSheet.emit({ event, data, type: 'events' });
    } else this.actionSheet.emit({ event, data, type: 'news' });
  }

  //hide news
  handleHidden(data: any) {
    this.hidden.emit(data);
  }

  //show modal list user react
  setOpen(value: boolean) {
    this.isShowListUser = value;
  }
}
