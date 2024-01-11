import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import * as _ from 'lodash';
import { ResourceAcessDataService } from '../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
})
export class OrganizationListComponent implements OnInit {
  @Input() organizations: any[] = [];

  @Input() description: string = '';
  @Input() isOwner: boolean = false;
  @Input() isSelectCheckbox: boolean = false;
  @Input() isLoading: boolean = true;

  @Output() arrayOrganizationIdChecked: EventEmitter<string[]> =
    new EventEmitter();
  @Output() changeOrganization = new EventEmitter<any>();
  @Output() getThumbnail = new EventEmitter<string>();
  @Output() followOrg = new EventEmitter();

  classNameThumbnail: string = 'list';
  isLogo: boolean = true;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private resourceAcessDataService: ResourceAcessDataService
  ) {}

  ngOnInit() {}

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

  hasPermission(permission: string, organizationId: string): boolean {
    return this.resourceAcessDataService.hasPermission(
      permission,
      organizationId,
      'organization'
    );
  }

  getIAMGroupName(organizationId: string) {
    let iamGroupName = '';
    const resourceAcess = this.resourceAcessDataService.resourceAcessBus$.value;
    if (resourceAcess) {
      const organizationResourceAcess = _.find(
        resourceAcess.organizations,
        (organization: any) => organization.organization_id === organizationId
      );
      if (
        organizationResourceAcess &&
        organizationResourceAcess.iam_group?.name
      ) {
        iamGroupName = this.translate.instant(
          'SELECT.OPTION.IAM_GROUP.' + organizationResourceAcess.iam_group.name
        );
      }
    }

    return iamGroupName;
  }

  arrayyOrganizationId: string[] = [];
  changeCheckbox(event: any, id: string) {
    if (this.arrayyOrganizationId.length === 0)
      this.arrayyOrganizationId.push(id);
    else {
      if (event.target.checked) {
        this.arrayyOrganizationId.map((el) => {
          if (el === id) return;
          else this.arrayyOrganizationId.push(id);
        });
      } else {
        this.arrayyOrganizationId = this.arrayyOrganizationId.filter(
          (el) => el !== id
        );
      }
    }
    this.arrayOrganizationIdChecked.emit(this.arrayyOrganizationId);
  }

  getSrcImage(thumbnail: string) {
    this.getThumbnail.emit(thumbnail);
  }
  followOrganization(id: string) {
    this.followOrg.emit(id);
  }
}
