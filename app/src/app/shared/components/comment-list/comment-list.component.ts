import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { THUMBNAIL_URL } from '../../../constant';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  @Input() me: any = {};
  @Input() comments: any[] = [];
  @Input() authorId: string = '';
  @Input() isLoading: boolean = false;
  @Output() deleteComment = new EventEmitter();
  @Output() replies = new EventEmitter();
  @Output() editComment = new EventEmitter();

  isAvatar: boolean = true;
  isLineComment: boolean = true;

  images: any[] = [];
  isActionSheetOpen = false;
  isActionSheetOpenOther = false;
  isShowAll: boolean = false;
  dataResult: any;
  itemId: any;

  public actionSheetButtons = [
    {
      text: this.translate.instant('BUTTON.EDIT'),
      role: 'edit',
      data: {
        action: 'edit',
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

  public actionSheetButtonOthers = [
    {
      text: this.translate.instant('BUTTON.REPORT'),
      role: 'report',
      data: {
        action: 'report',
      },
    },
    {
      text: this.translate.instant('BUTTON.HIDDEN_COMMENT'),
      role: 'hidden',
      data: {
        action: 'hidden',
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

  constructor(private translate: TranslateService, private router: Router) {}

  ngOnInit(): void {}

  showAllComment(value: boolean, id: any) {
    this.isShowAll = value;
    this.itemId = id;
    this.isLineComment = false;
  }

  //reply comment
  replyComment(data: any) {
    this.replies.emit(data);
  }

  //action sheet
  setOpenActionSheet(item: any, role: string, reply?: any) {
    if (role === 'me') {
      if (reply) {
        this.dataResult = {
          parentId: item.id,
          childrenId: reply.id,
          childrenName: reply.name,
        };
      } else {
        this.dataResult = {
          parentId: item.id,
          parentName: item.name,
        };
      }

      this.isActionSheetOpen = true;
      this.isActionSheetOpenOther = false;
    } else if (role === 'other') {
      if (reply) {
        this.dataResult = {
          parentId: item.id,
          childrenId: reply.id,
          childrenName: reply.name,
        };
      } else {
        this.dataResult = {
          parentId: item.id,
          parentName: item.name,
        };
      }

      this.isActionSheetOpenOther = true;
      this.isActionSheetOpen = false;
    }
  }

  //action detail news
  setResult(ev: any, role: string) {
    if (role === 'me') {
      if (ev?.detail?.data?.action === 'edit') {
        this.editComment.emit(this.dataResult);
      } else if (ev?.detail?.data?.action === 'delete') {
        let id = '';
        if (this.dataResult.childrenId) id = this.dataResult.childrenId;
        else id = this.dataResult.parentId;
        this.deleteComment.emit(id);
      } else {
        this.isActionSheetOpen = false;
      }
    } else {
      if (ev?.detail?.data?.action === 'report') {
      } else if (ev?.detail?.data?.action === 'hidden') {
      } else {
        this.isActionSheetOpen = false;
      }
    }
    this.isActionSheetOpen = false;
  }

  onError(data: any) {
    return (data.thumbnail = THUMBNAIL_URL);
  }

  redirectUser(ev: any) {
    if (ev.target.className.includes('text-blue-600')) {
      let userId = ev.target.className.replace('text-blue-600', '').trim();
      this.router.navigate(['tabs', 'users', userId]);
    }
  }
}
