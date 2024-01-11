import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IssuesService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ISSUE_TYPES } from '../../../../../../constant';
import { IIssueResponse } from '../../../../../../interface/issue.interface';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.page.html',
  styleUrls: ['./issue-detail.page.scss'],
})
export class IssueDetailPage implements OnInit {
  issue: IIssueResponse = {} as IIssueResponse;
  comments: any = [];
  id: any = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private issueService: IssuesService
  ) {}

  ngOnInit() {
    this.getIssue();
  }

  goBack() {
    this.location.back();
  }

  getIssue() {
    this.id = this.route.snapshot.paramMap.get('issueId')?.toString();
    if (this.id) {
      this.issueService.getIssue(this.id).subscribe((res) => {
        this.issue = res;
      });
    }
  }

  displayType(id: number): string {
    const type = _.find(ISSUE_TYPES, (type) => type.id === id);
    if (type) {
      return type.name;
    }
    return this.displayType(0);
  }
}
