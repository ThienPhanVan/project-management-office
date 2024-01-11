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
import { TranslateService } from '@ngx-translate/core';
import { NewsDataService } from '../../services';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-opportunity-item',
  templateUrl: './opportunity-item.component.html',
  styleUrls: ['./opportunity-item.component.scss'],
})
export class OpportunityItemComponent implements OnInit {
  @Input() me: any = {};
  @Input() indexNews: any = 0;
  @Input() data: any = {};
  @Input() isLoading: boolean = false;
  @Input() hostNameLocation: string = '';

  @Output() heart: EventEmitter<string> = new EventEmitter();
  @Output() modalUsers: EventEmitter<boolean> = new EventEmitter();
  @Output() hidden = new EventEmitter();
  @Output() undo = new EventEmitter();
  @Output() actionSheet = new EventEmitter();
  @Output() tagSearch = new EventEmitter();
  @Output() zoomImage = new EventEmitter();
  @Output() dataPost = new EventEmitter();

  hasBid: boolean = true;
  isAvatar: boolean = true;
  isOrg: boolean = false;
  idForData: string = '';
  isShowMore: boolean = false;
  lengthContent: number = 0;

  // userMe: any;
  constructor(
    private route: Router,
    private translate: TranslateService,
    private newsDataService: NewsDataService,
    private groupService: GroupService,
    private router: Router
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

  ngOnInit(): void {
    if (this.data?.organization) {
      this.isOrg = true;
    }
  }

  //thả tim
  onHeart(id: string) {
    this.heart.emit(id);
  }

  clickRedirectDetail(ev: any) {
    localStorage.setItem('isComment', 'true');
    this.newsDataService.setNewDetail(this.data);
    this.route.navigate([`/tabs/opportunities/${this.data.id}`]);
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
  onZoom(data: { index: number; data: any }) {
    this.zoomImage.emit(data);
  }

  //get data post bided
  getDataPostBided(data: any) {
    this.dataPost.emit(data);
  }

  async sendMessage(ev: any) {
    const groupData = {
      is_private: 0,
      member_ids: [ev.author.id],
    };
    this.groupService.createGroup(groupData).subscribe((res) => {
      this.router.navigate(['/group', res.id]);
    });
  }
}
