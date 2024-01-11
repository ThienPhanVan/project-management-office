import * as _ from 'lodash';

import { Component, Input, OnInit } from '@angular/core';
import { ISSUE_TYPES } from 'src/app/constant';

@Component({
  selector: 'app-daily-issue-item',
  templateUrl: './daily-issue-item.component.html',
  styleUrls: ['./daily-issue-item.component.scss'],
})
export class DailyIssueItemComponent implements OnInit {
  @Input() issue: any = {};

  constructor() {}

  ngOnInit() {}

  displayType(id: number): string {
    const type = _.find(ISSUE_TYPES, (type) => type.id === id);
    if (type) {
      return type.name;
    }
    return this.displayType(0);
  }
}
