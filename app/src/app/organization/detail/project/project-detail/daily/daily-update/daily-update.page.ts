import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ISSUE_TYPES } from '../../../../../../constant';
import { IIssue } from '../../../../../../interface/issue.interface';
import { UserDetail } from '../../../../../../interface/user.interface';
import { IssuesService } from '../../../../../../services';
import { DailyService } from '../../../../../../services/daily.service';

@Component({
  selector: 'app-daily-update',
  templateUrl: './daily-update.page.html',
  styleUrls: ['./daily-update.page.scss'],
})
export class DailyUpdatePage implements OnInit {
  formGroup: FormGroup;
  projectId: string;
  dailyId: string;

  issueTypes = ISSUE_TYPES;

  users: UserDetail[] = [];
  issues: IIssue[] = [];

  toastMessage: string = '';

  isUpdating: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private issuesServices: IssuesService,
    private dailyService: DailyService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.formGroup = this.initFormGroup();
    this.projectId = this.getProjectId();
    this.dailyId = this.getDailyId();
    this.getDetail();
  }

  ngOnInit() {
    this.getIssues();
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getIssues() {
    this.issuesServices
      .getIssues({ project_id: this.projectId, limit: 0 })
      .subscribe((res) => {
        this.issues = res.data;
      });
  }

  goBack() {
    this.location.back();
  }

  actionSubmit() {
    const daily = { ...this.formGroup.value, project_id: this.projectId };

    this.update(daily);
  }

  getDetail() {
    this.dailyService
      .getDaily(this.dailyId, {
        include: 'issues_yesterday,issues_today,user',
      })
      .subscribe((res) => {
        // console.log(res)
        this.formGroup.patchValue(res);
      });
  }

  update(daily: any) {
    this.dailyService.updateDaily(daily, this.dailyId).subscribe(
      () => {
        this.isUpdating = false;
        this.toastMessage = 'update successfully';
        this.goBack();
      },
      () => {
        this.isUpdating = false;
        this.toastMessage = 'There was an error updating';
      }
    );
  }

  initFormGroup() {
    return this.formBuilder.group({
      issues_yesterday_ids: [null],
      issues_today_ids: [null],
      note_yesterday: [''],
      note_today: [''],
      note_issue_today: [''],
    });
  }

  getDailyId() {
    return this.route.snapshot.paramMap.get('dailyId')?.toString() || '';
  }

  valueChange(key: string, value: string) {
    this.formGroup.get(key)?.setValue(value);
  }

  closeToast() {
    this.toastMessage = '';
  }
}
