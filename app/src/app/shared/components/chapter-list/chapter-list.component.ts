import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ResourceAcessDataService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss'],
})
export class ChapterListComponent implements OnInit, OnChanges {
  @Input() chapters: any[] = [];
  @Input() isLoading: boolean = true;
  @Input() isShowButton: boolean = true;

  @Output() joined = new EventEmitter();
  @Output() reject = new EventEmitter();

  constructor(
    private resourceAcessDataService: ResourceAcessDataService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    let currentChapters = changes['chapters']?.currentValue;
    let previousChapters = changes['chapters']?.previousValue;
    if (!_.isNil(previousChapters) && _.isNil(currentChapters)) {
      this.isLoading = false;
    }
  }

  getIAMGroupName(chapterId: string) {
    let iamGroupName = '';
    const resourceAcess = this.resourceAcessDataService.resourceAcessBus$.value;
    if (resourceAcess) {
      const chapterResourceAcess = _.find(
        resourceAcess.chapters,
        (chapter: any) => chapter.chapter_id === chapterId
      );

      if (chapterResourceAcess && chapterResourceAcess.iam_group?.name) {
        iamGroupName = this.translate.instant(
          'SELECT.OPTION.IAM_GROUP.' + chapterResourceAcess.iam_group.name
        );
      }
    }
    return iamGroupName;
  }
  joinChapter(id: string) {
    this.joined.emit(id);
  }
  rejectJoinChapter(id: string) {
    this.reject.emit(id);
  }
  routerChapterDetail(item: any) {
    if (item.is_member) {
      this.router.navigate(['/tabs', 'chapters', item.id]);
    }
  }
}
