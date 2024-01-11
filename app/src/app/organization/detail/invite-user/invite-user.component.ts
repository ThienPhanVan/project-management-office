import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { phoneRegex, emailPattern } from '../../../constant/index';
import { OrganizationsService, UserService } from 'src/app/services';
import { ListUsers, UserDetail } from 'src/app/interface/user.interface';
import * as _ from 'lodash';
import { OrganizationUserService } from '../../../services/organization-user.service';
import { OrganizationDataService } from '../../../shared/services';

@Component({
  selector: 'app-invite-user-organization',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
})
export class InviteUserOrganizationComponent implements OnInit {
  @Input() organization: any;
  @Input() isLoading: boolean = true;
  @Output() getThumbnail = new EventEmitter<string>()

  form: FormGroup;
  users: UserDetail[] = [];

  isSendingMail: boolean = false;
  showMail: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private organizationUserService: OrganizationUserService,
    private organizationsService: OrganizationsService,
    private organizationDataService: OrganizationDataService,
  ) {
    this.form = this.initForm();
  }

  initForm() {
    return this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    });
  }

  ngOnInit() {}

  actionSearchUser(phone: string) {
    this.users = [];
    if (phone) {
      this.userService
        .getUsers({ phone: phone })
        .subscribe((res: ListUsers) => {
          if (res.data && res.data.length > 0) {
            this.users = res.data;
            this.getOrganizationUserStatus();
            this.showMail = false;
          } else {
            this.users = [];
            this.showMail = true;
          }
        });
    }
  }

  getOrganizationUserStatus() {
    const userIdsHasStatus = _.intersection(
      _.map(this.users, 'id'),
      _.map(this.organization.users, 'id')
    );
    if (userIdsHasStatus) {
      _.forEach(
        userIdsHasStatus,
        (userId: string) =>
          (_.keyBy(this.users, 'id')[userId].organization_user = _.keyBy(
            this.organization.users,
            'id'
          )[userId].organization_user)
      );
    }
  }

  actionSendMail() {
    this.isSendingMail = true;

    console.log(this.form.value);

    this.organizationUserService
    .inviteUsers(this.organization.id, {
      ...this.form.value
    })
    .subscribe(() => {
      this.refreshOrganizationDetail();
      this.refreshMyOrganizations();
      this.isSendingMail = true;
    });
    
  }

  sendInvite(user: UserDetail) {
    const body = {
      user_ids: [user.id],
      position_id: user.organization_user?.position_id,
    };
    this.organizationUserService
      .inviteUsers(this.organization.id, body)
      .subscribe(() => {
        this.refreshOrganizationDetail();
        this.refreshMyOrganizations();
        this.isSendingMail = true;
      });
  }

  refreshMyOrganizations() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (user_id) {
      const query = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((orgs) => {
        this.organizationDataService.setMyOrganizations(orgs.data);
      });
    }
  }

  refreshOrganizationDetail() {
    if (this.organization?.id) {
      // get org
      const orgQuery = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,iam_groups,chapters,childen_organization_users,children_organization_users_position,children_organization_users_iam_group',
      };
      this.organizationsService
        .getOrganization(this.organization.id, orgQuery)
        .subscribe((res) => {
          if (res) {
            this.organizationDataService.setOrganizationDetail(res);
          }
        });
    }
  }

  inputPhone() {
    const phone = this.form.value.phone.trim();
    this.actionSearchUser(phone);
  }

  getSrcImage(thumbnail: string) {
    this.getThumbnail.emit(thumbnail)
  }
}
