import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ISSUE_TYPES } from '../../../../../../constant';
import { IIssue } from '../../../../../../interface/issue.interface';
import { UserDetail } from '../../../../../../interface/user.interface';
import {
  UserService,
  ProjectStatusService,
  ProjectPrioritiesService,
  ProjectVersionsService,
  ProjectMilestonesService,
  IssuesService,
} from '../../../../../../services';
import { MasterDataService } from '../../../../../../shared/services';

@Component({
  selector: 'app-issue-update',
  templateUrl: './issue-update.page.html',
  styleUrls: ['./issue-update.page.scss'],
})
export class IssueUpdatePage implements OnInit {
  formGroup: FormGroup;
  projectId: string;
  issueId: string;

  test1: any;

  issueTypes = ISSUE_TYPES;

  users: UserDetail[] = [];
  statuses: any[] = [];
  priorities: any[] = [];
  milestones: any[] = [];
  issues: IIssue[] = [];
  versions: any[] = [];

  toastMessage: string = '';

  isUpdating: boolean = false;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private masterDataService: MasterDataService,
    private projectStatusService: ProjectStatusService,
    private projectPrioritiesService: ProjectPrioritiesService,
    private projectVersionsService: ProjectVersionsService,
    private projectMilestonesService: ProjectMilestonesService,
    private route: ActivatedRoute,
    private issuesServices: IssuesService
  ) {
    this.formGroup = this.initFormGroup();
    this.projectId = this.getProjectId();
    this.issueId = this.getIssueId();
  }

  ngOnInit() {
    this.getUsers();
    this.getMyId();
    this.getStatuses();
    this.getPriorities();
    this.getProjectId();
    this.getIssues();
    this.getVersions();
    this.getIssue();
  }

  getIssue() {
    this.issuesServices.getIssue(this.issueId).subscribe((res) => {
      this.formGroup.patchValue(res);
    });
  }

  actionSubmit() {
    const issue = { ...this.formGroup.value, project_id: this.projectId };

    this.update(issue);
  }

  update(issue: IIssue) {
    this.issuesServices.updateIssue(issue, this.issueId).subscribe(
      () => {
        this.toastMessage = 'Update successfully!';
        this.isUpdating = false;
        this.goBack();
      },
      () => {
        this.toastMessage = "There're errors when update!";
        this.isUpdating = false;
      }
    );
  }

  initFormGroup() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      assignee_id: [null, [Validators.required]],
      status_id: [null, [Validators.required]],
      priority_id: [null],
      parent_id: [null],
      version_id: [null],
      milestone_id: [null],
      type: [0, [Validators.required]],
      estimate_hours: [0],
      actual_hours: [0],
      due_date: [moment().toISOString()],
      start_date: [moment().toISOString()],
    });
  }

  closeToast() {
    this.toastMessage = '';
  }

  getUsers() {
    const organizationId =
      this.route.snapshot.paramMap.get('organizationId')?.toString() || '';
    this.userService
      .getUsers({ organization_id: organizationId, limit: 0 })
      .subscribe((res) => {
        this.users = res.data;
        _.forEach(this.users, (user) => {
          user.name = user.username;
        });
      });
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getIssueId() {
    return this.route.snapshot.paramMap.get('issueId')?.toString() || '';
  }

  getIssues() {
    this.issuesServices
      .getIssues({ project_id: this.projectId, limit: 0 })
      .subscribe((res) => {
        this.issues = res.data;
      });
  }

  getVersions() {
    this.projectVersionsService
      .getVersions(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.versions = res.data;
      });
  }

  getMilestones() {
    this.projectMilestonesService
      .getMilestones(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.milestones = res.data;
      });
  }

  getStatuses() {
    this.projectStatusService
      .getStatuses(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.statuses = res.data;
      });
  }

  getPriorities() {
    this.projectPrioritiesService
      .getPriorities(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.priorities = res.data;
      });
  }

  goBack() {
    this.location.back();
  }

  getMyId() {
    this.masterDataService.me$.subscribe((res) => {
      this.formGroup.patchValue({ assignee_id: res.id });
    });
  }

  valueChange(key: string, value: string) {
    this.formGroup.get(key)?.setValue(value);
  }
}
