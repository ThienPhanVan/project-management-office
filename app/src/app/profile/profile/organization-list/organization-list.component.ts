import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import * as _ from 'lodash';
import { OrganizationUserService } from '../../../services/organization-user.service';
import { OrganizationDataService, ResourceAcessDataService } from '../../../shared/services';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization } from '../../../interface';
import { OrganizationsService } from '../../../services';

@Component({
  selector: 'app-profile-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
})
export class ProfileOrganizationListComponent implements OnInit, OnChanges{
  @Input() organizations: any[] = [];
  @Input() description: string = '';
  @Input() isOwner: boolean = false;
  @Input() isInvited: boolean = false;
  @Input() isLoading: boolean = true;
  
  classNameThumbnail: string = "list";
  isLogo: boolean = true

  @Output() changeOrganization = new EventEmitter<any>();

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private organizationUserService: OrganizationUserService,
    private resourceAcessDataService: ResourceAcessDataService,
    private organizationsService: OrganizationsService,
    private organizationDataService: OrganizationDataService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentOrganizations = changes['organizations']?.currentValue;
    let previousOrganizations = changes['organizations']?.previousValue;
    if(!_.isNil(previousOrganizations) && _.isNil(currentOrganizations)){
      this.isLoading = false;
    }
  }

  hasPermission(permission: string, organizationId: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      organizationId,
      'organization'
    );
  }

  getOrganizationIAMGroupName(organizationId: string) {
    let iamGroupName = '';
    const resourceAcess = this.resourceAcessDataService.resourceAcessBus$.value;
    if (resourceAcess) {
      const organizationResourceAcess = _.find(
        resourceAcess.organizations,
        (organization: any) => organization.organization_id === organizationId
      );
      if (organizationResourceAcess && organizationResourceAcess.iam_group?.name) {
        iamGroupName = this.translate.instant('SELECT.OPTION.IAM_GROUP.' +
          organizationResourceAcess.iam_group.name
        );
      }
    }
    return iamGroupName;
  }

  responseInvited(orgId: string, status: number) {
    const body = {
      status: status,
    };
    this.organizationUserService.responseInvited(orgId, body).subscribe(() => {
      this.refreshMyOrganizations()
      this.changeOrganization.emit(this.organizations);
    });
  }

  refreshMyOrganizations() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if  (!_.isNil(user_id)) {
      const query = {
        include:
          'users,industries,services,country,city,organization_users,organization_users_position,organization_users_iam_group,children,childen_organization_users,children_organization_users_position,children_organization_users_iam_group,iam_groups,chapters',
        user_id: user_id,
      };
      this.organizationsService.getOrganizations(query).subscribe((res) => {
        this.organizationDataService.setMyOrganizations(res.data);
      });
    }
  }

  getOrganizationUser(org: IOrganization){
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    const user = _.find(_.get(org, 'users'), (user) => _.get(user, 'id') === user_id);
    return user?.organization_user
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Share',
          data: {
            action: 'share',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  showModal: boolean = false;
  imagesString: string = ""
  getSrcImage(thumbnail: string) {
    this.showModal = true
    this.imagesString = thumbnail
  }

  closeModal(value: boolean) {
    this.showModal = value;
    this.imagesString = ''
  }
}
