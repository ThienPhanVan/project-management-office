import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { IIAMGroup } from '../../interface';
import { IChapter } from '../../interface/chapter.interface';

@Injectable({
  providedIn: 'root',
})
export class ChapterDataService {
  private chapterDetailBus$ = new BehaviorSubject<IChapter>({} as IChapter);
  chapterDetail$ = this.chapterDetailBus$.asObservable();

  private myChaptersBus$ = new BehaviorSubject<IChapter[]>([{} as IChapter]);
  myChapters$ = this.myChaptersBus$.asObservable();

  private iamGroupsBus$ = new BehaviorSubject<IIAMGroup[]>([{} as IIAMGroup]);
  iamGroups$ = this.iamGroupsBus$.asObservable();

  constructor() {}

  setChapterDetail(chapter: IChapter) {
    this.chapterDetailBus$.next(chapter);
  }  
  
  setMyChapters(chapters: IChapter[]) {
    this.myChaptersBus$.next(chapters);
  }

  setIamGroups(iamGroups: IIAMGroup[]) {
    this.iamGroupsBus$.next(iamGroups);
  }
}
