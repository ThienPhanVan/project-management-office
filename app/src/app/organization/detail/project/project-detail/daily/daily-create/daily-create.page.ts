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
  selector: 'app-daily-create',
  templateUrl: './daily-create.page.html',
  styleUrls: ['./daily-create.page.scss'],
})
export class DailyCreatePage implements OnInit {
  formGroup: FormGroup;
  projectId: string;

  issueTypes = ISSUE_TYPES;

  users: UserDetail[] = [];
  issues: IIssue[] = [];

  toastMessage: string = '';

  isCreating: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private issuesServices: IssuesService,
    private dailyService: DailyService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.formGroup = this.initFormGroup();
    this.projectId = this.getProjectId();
  }

  ngOnInit() {
    this.getIssues()
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getIssues() {
    this.issuesServices
      .getIssues({ project_id: this.projectId, limit:0 })
      .subscribe((res) => {
        this.issues = res.data;
      });
  }

  goBack() {
    this.location.back();
  }

  actionSubmit() {
    const daily = { ...this.formGroup.value, project_id: this.projectId };

    this.create(daily);
  }

  create(daily: any) {
    this.dailyService.addDaily(daily).subscribe(
      () => {
        this.isCreating = false;
        this.toastMessage = 'Create successfully';
        this.goBack();
      },
      () => {
        this.isCreating = false;
        this.toastMessage = 'There was an error creating';
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

  valueChange(key:string, value:string){
    this.formGroup.get(key)?.setValue(value)
  }

  closeToast() {
    this.toastMessage = '';
  }
}
