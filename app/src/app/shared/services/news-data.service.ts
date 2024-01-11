import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class NewsDataService {
  private newsDetailBus$ = new BehaviorSubject<any>({} as any);
  newsDetail$ = this.newsDetailBus$.asObservable();

  private newsEventDetailBus$ = new BehaviorSubject<any>({} as any);
  newsEventDetail$ = this.newsEventDetailBus$.asObservable();

  private myNewsBus$ = new BehaviorSubject<any[]>([{} as any]);
  myNews$ = this.myNewsBus$.asObservable();

  private myNewsFilterBus$ = new BehaviorSubject<any>({});
  myNewsFilter$ = this.myNewsFilterBus$.asObservable();

  private myNewsCommentsBus$ = new BehaviorSubject<any>([]);
  myNewsComments$ = this.myNewsCommentsBus$.asObservable();

  private myBidsBus$ = new BehaviorSubject<any>({});
  myBids$ = this.myBidsBus$.asObservable();

  private myLanguageBus$ = new BehaviorSubject<any>('');
  myLanguage$ = this.myLanguageBus$.asObservable();

  // private myNewsCreateBus$ = new BehaviorSubject<any>({});
  // myNewsCreate$ = this.myNewsCreateBus$.asObservable();

  constructor() {}

  setNewDetail(newDetail: any) {
    this.newsDetailBus$.next(newDetail);
  }

  setNewEventDetail(newDetail: any) {
    this.newsEventDetailBus$.next(newDetail);
  }

  setMyNews(news: any[]) {
    this.myNewsBus$.next(news);
  }

  setMyNewsFilter(options: any) {
    this.myNewsFilterBus$.next(options);
  }

  setMyNewsComments(data: any) {
    this.myNewsCommentsBus$.next(data);
  }

  setMyBids(data: any) {
    this.myBidsBus$.next(data);
  }
  setMyLanguage(data: any) {
    this.myLanguageBus$.next(data);
  }
  // setMyNewsCreate(data: any) {
  //   this.myNewsCreateBus$.next(data);
  // }
}
