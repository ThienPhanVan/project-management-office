import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganizationsService } from 'src/app/services';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization } from '../../../interface';

@Component({
  selector: 'app-invite-organization-chapter',
  templateUrl: './invite-organization.component.html',
  styleUrls: ['./invite-organization.component.scss'],
})
export class InviteOrganizationChapterComponent implements OnInit {
  form: FormGroup;

  label: string = '';

  searchedOrganizations: IOrganization[] = [];
  organizations: IOrganization[] = [];

  isSendingMail: boolean = false;
  showMail: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private translate: TranslateService
  ) {
    this.form = this.initForm();
    this.getOrganizations();
  }

  initForm() {
    return this.formBuilder.group({
      field: ['', []],
    });
  }

  ngOnInit() {
    this.label = this.translate.instant('PLACEHOLDER.SEARCH');
  }

  getOrganizations() {
    const params = {
      include:
        'organization_users,organization_users_position,organization_users_iam_group,iam_groups,users',
    };
    this.organizationsService.getOrganizations(params).subscribe((res) => {
      this.organizations = res.data;
    });
  }

  onSearchChange() {
    this.searchedOrganizations = [];
    const params = {
      include:
        'organization_users,organization_users_position,organization_users_iam_group,iam_groups,users',
      q: this.form.controls['field'].value,
    };

    this.organizationsService.getOrganizations(params).subscribe(
      (res: any) => {
        if (res.data && res.data.length > 0) {
          this.searchedOrganizations = res.data;
        }
      },
      () => {
        this.searchedOrganizations = [];
      }
    );
  }
}
