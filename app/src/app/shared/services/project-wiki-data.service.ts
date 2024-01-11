import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ProjectWikiDataService {
  //Parent wiki list
  private myWikisBus$ = new BehaviorSubject<any>([]);
  myWikis$ = this.myWikisBus$.asObservable();

  //All wiki list
  private allWikisBus$ = new BehaviorSubject<any>([]);
  allWikis$ = this.allWikisBus$.asObservable();

  private myWikiDetailBus$ = new BehaviorSubject<any>([]);
  myWikiDetail$ = this.myWikiDetailBus$.asObservable();

  //Draft wiki description
  private myDraftWikiDescriptionBus$ = new BehaviorSubject<string>('');
  myDraftWikiDescription$ = this.myDraftWikiDescriptionBus$.asObservable();

  constructor() {}
  
  setMyWikis(wikis: any) {
    this.myWikisBus$.next(wikis);
  }
  
  setAllWikis(wikis: any) {
    this.allWikisBus$.next(wikis);
  }
    
  setMyWikiDetail(wiki: any) {
    this.myWikiDetailBus$.next(wiki);
  }
    
  setMyDraftWikiDescription(description: string) {
    this.myDraftWikiDescriptionBus$.next(description);
  }
}
