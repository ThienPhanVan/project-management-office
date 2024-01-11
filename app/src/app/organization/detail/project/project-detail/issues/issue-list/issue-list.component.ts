import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Input } from '@angular/core';
import * as _ from 'lodash';
import { ISSUE_TYPES } from '../../../../../../constant';
import { IIssue } from '../../../../../../interface/issue.interface';
import { IssuesService } from '../../../../../../services';
import { IssueDataService } from '../../../../../../shared/services';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss'],
})
export class IssueListComponent implements OnInit {
  @Input() filterOptions: any = {};
  issues: IIssue[] = [];

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;

  constructor(
    private issuesService: IssuesService,
    private issueDataService: IssueDataService,
    private route: ActivatedRoute
  ) {
    this.issuesSubscibe();
    this.issuesFilterSubscribe();
  }

  ngOnInit() {
    this.getIssues();
  }

  getIssues() {
    this.isLoading = true;
    if (this.offset <= this.count) {
      const projectId = this.route.snapshot.paramMap
        .get('projectId')
        ?.toString();

      let params: any = {
        include: 'project,milestone,status,version,priority,assignee',
        project_id: projectId || '262c7dca-f447-4eae-8f34-2c775ee80c70',
        limit: this.limit,
        offset: this.offset,
      };

      if (this.filterOptions) {
        params = { ...params, ...this.validateOptions(this.filterOptions) };
      }

      this.issuesService.getIssues(params).subscribe((res) => {
        if (res && res.data) {
          this.isLoading = false;
          // this.issues = res.data;
          this.issueDataService.setMyIssues([...this.issues, ...res.data]);
          this.offset = this.issues?.length;
          this.count = +res.paging.count;
        }
      });
    }
  }

  //convert list to string
  validateOptions(options: any) {
    let result: any = {};
    _.forEach(_.keys(options), (key) => {
      if (_.isArray(options[key]) && options[key].length) {
        result[key] = _.join(options[key], ',');
      }
    });
    return result;
  }

  displayType(id: number): string {
    const type = _.find(ISSUE_TYPES, (type) => type.id === id);
    if (type) {
      return type.name;
    }
    return this.displayType(0);
  }

  issuesSubscibe() {
    this.issueDataService.myIssues$.subscribe((res) => {
      this.issues = res;
    });
  }

  issuesFilterSubscribe() {
    this.issueDataService.myIssuesFilter$.subscribe((res) => {
      if (_.keys(res).length) {
        this.filterOptions = res;
        this.offset = 0;
        this.count = 0;
        this.count = 0;
        this.issueDataService.setMyIssues([]);
        this.getIssues();
      } else {
        this.filterOptions = JSON.parse(
          localStorage.getItem('issuesFilter') || '{}'
        );
      }
    });
  }

  onIonInfinite(ev: any) {
    this.getIssues();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  isOutdate(issue: any) {
    return (
      moment().isAfter(issue.due_date) &&
      !['Done', 'Resolved'].includes(issue.status?.name)
    );
  }
}
