import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { IIssue } from '../../interface/issue.interface';

@Injectable({
  providedIn: 'root',
})
export class IssueDataService {
  private myIssuesBus$ = new BehaviorSubject<IIssue[]>([]);
  myIssues$ = this.myIssuesBus$.asObservable();

  private myIssuesFilterBus$ = new BehaviorSubject<any>({});
  myIssuesFilter$ = this.myIssuesFilterBus$.asObservable();

  constructor() {}

  setMyIssues(issues: IIssue[]) {
    this.myIssuesBus$.next(issues);
  }

  setMyIssuesFilter(options: any) {
    this.myIssuesFilterBus$.next(options);
  }
}
