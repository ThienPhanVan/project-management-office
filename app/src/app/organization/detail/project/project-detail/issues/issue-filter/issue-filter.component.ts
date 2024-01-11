import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ISSUE_TYPES } from '../../../../../../constant';
import { IIssue } from '../../../../../../interface/issue.interface';
import { UserDetail } from '../../../../../../interface/user.interface';
import {
  UserService,
  ProjectStatusService,
  ProjectPrioritiesService,
  ProjectVersionsService,
  IssuesService,
} from '../../../../../../services';
import { IssueDataService } from '../../../../../../shared/services';

@Component({
  selector: 'app-issue-filter',
  templateUrl: './issue-filter.component.html',
  styleUrls: ['./issue-filter.component.scss'],
})
export class IssueFilterComponent implements OnInit {
  isOpen: boolean = false;

  formGroup: FormGroup;
  projectId: string;

  issueTypes = ISSUE_TYPES;

  users: UserDetail[] = [];
  statuses: any[] = [];
  priorities: any[] = [];
  milestones: any[] = [];
  issues: IIssue[] = [];
  versions: any[] = [];

  toastMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private projectStatusService: ProjectStatusService,
    private projectPrioritiesService: ProjectPrioritiesService,
    private projectVersionsService: ProjectVersionsService,
    private route: ActivatedRoute,
    private issuesService: IssuesService,
    private issueDataService: IssueDataService
  ) {
    this.formGroup = this.initFormGroup();
    this.projectId = this.getProjectId();
    this.issuesFilterSubscribe();
  }

  ngOnInit() {
    this.getUsers();
    this.getStatuses();
    this.getPriorities();
    this.getProjectId();
    this.getVersions();
    this.getIssues();
  }

  submit() {
    const options = this.validateOptions(this.formGroup.value);

    localStorage.setItem('issuesFilter', JSON.stringify(options));
    this.issueDataService.setMyIssuesFilter(options);
  }

  clear() {
    this.formGroup.reset();
  }

  //remove empty options
  validateOptions(options: any) {
    let result: any = {};
    _.forEach(_.keys(options), (key) => {
      if (options[key] || options[key] === 0) {
        result[key] = options[key];
      }
    });
    return result;
  }

  issuesFilterSubscribe() {
    this.issueDataService.myIssuesFilter$.subscribe((res) => {
      if (_.keys(res).length) {
        this.formGroup = this.initFormGroup();
        this.formGroup.patchValue(res);
      } else {
        this.formGroup.patchValue(
          JSON.parse(localStorage.getItem('issuesFilter') || '{}')
        );
      }
    });
  }

  initFormGroup() {
    return this.formBuilder.group({
      name: [''],
      description: [''],
      type: [null],
      assignee_id: [null],
      status_id: [null],
      priority_id: [null],
      parent_id: [null],
      milestone_id: [null],
    });
  }

  closeToast() {
    this.toastMessage = '';
  }

  getUsers() {
    const organizationId =
      this.route.snapshot.paramMap.get('organizationId')?.toString() ||
      'efe87002-8bc2-4306-9db6-205b487abba6';
    this.userService
      .getUsers({ organization_id: organizationId })
      .subscribe((res) => {
        this.users = res.data;

        _.forEach(this.users, (user) => {
          user.name = user.username;
        });
      });
  }

  getIssues() {
    this.issuesService
      .getIssues({ project_id: this.projectId })
      .subscribe((res) => {
        this.issues = res.data;
      });
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getStatuses() {
    this.projectStatusService.getStatuses(this.projectId).subscribe((res) => {
      this.statuses = res.data;
    });
  }

  getVersions() {
    this.projectVersionsService.getVersions(this.projectId).subscribe((res) => {
      this.versions = res.data;
    });
  }

  getPriorities() {
    this.projectPrioritiesService
      .getPriorities(this.projectId)
      .subscribe((res) => {
        this.priorities = res.data;
      });
  }

  formChange(key: string, value: any) {
    this.formGroup.get(key)?.setValue(value);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
