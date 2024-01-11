import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-issue-create',
  templateUrl: './issue-create.page.html',
  styleUrls: ['./issue-create.page.scss'],
})
export class IssueCreatePage implements OnInit {
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

  isCreating: boolean = false;

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
  }

  ngOnInit() {
    this.getUsers();
    this.getMyId();
    this.getStatuses();
    this.getPriorities();
    this.getProjectId();
    this.getVersions();
    this.getIssues();
    this.getMilestones();
  }

  actionSubmit() {
    const issue = { ...this.formGroup.value, project_id: this.projectId };

    this.create(issue);
  }

  create(issue: IIssue) {
    this.issuesServices.addIssue(issue).subscribe(
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
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      assignee_id: [null, [Validators.required]],
      status_id: [null, [Validators.required]],
      priority_id: [null],
      version_id: [null],
      parent_id: [null],
      milestone_id: [null],
      type: [1, [Validators.required]],
      estimate_hours: [0],
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
      .getUsers({
        organization_id: 'efe87002-8bc2-4306-9db6-205b487abba6',
        limit: 0,
      })
      .subscribe((res) => {
        this.users = res.data;
        _.forEach(this.users, (user) => {
          user.name = user.username;
        });
      });
  }

  getIssues() {
    this.issuesServices
      .getIssues({ project_id: this.projectId, limit: 0 })
      .subscribe((res) => {
        this.issues = res.data;
      });
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getStatuses() {
    this.projectStatusService
      .getStatuses(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.statuses = res.data;
        if (
          this.statuses &&
          this.statuses.length &&
          !this.formGroup.value.status_id
        ) {
          this.formGroup.patchValue({ status_id: this.statuses[0].id });
        }
      });
  }

  getVersions() {
    this.projectVersionsService
      .getVersions(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.versions = res.data;
        if (
          this.versions &&
          this.versions.length &&
          !this.formGroup.value.version_id
        ) {
          this.formGroup.patchValue({
            version_id: this.versions[this.versions.length - 1].id,
          });
        }
      });
  }

  getPriorities() {
    this.projectPrioritiesService
      .getPriorities(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.priorities = res.data;
        if (
          this.priorities &&
          this.priorities.length &&
          !this.formGroup.value.priority_id
        ) {
          this.formGroup.patchValue({ priority_id: this.priorities[0].id });
        }
      });
  }

  getMilestones() {
    this.projectMilestonesService
      .getMilestones(this.projectId, { limit: 0 })
      .subscribe((res) => {
        this.milestones = res.data;
        if (
          this.milestones &&
          this.milestones.length &&
          !this.formGroup.value.milestone_id
        ) {
          this.formGroup.patchValue({ milestone_id: this.milestones[0].id });
        }
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
