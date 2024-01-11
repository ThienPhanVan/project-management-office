import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { IIAMGroup } from '../../interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ResourceAcessDataService {
  public resourceAcessBus$ = new BehaviorSubject<any>({});
  public resourceAcess$ = this.resourceAcessBus$.asObservable();

  constructor(private translate: TranslateService) {}

  setResourceAcess(resourceAccess: any) {
    this.resourceAcessBus$.next(resourceAccess);
  }

  hasPermission(
    permission: string,
    id: string,
    type: 'organization' | 'chapter'
  ) {
    if (id) {
      const iam_group = this.getIAMGroup(id, type);
      const permisstions = _.map(iam_group?.iam_permissions, 'name') || [];
      return permisstions && _.includes(permisstions, permission);
    }
    return false;
  }

  getResourceAcess(id: string, type: 'organization' | 'chapter') {
    if (type === 'organization') {
      return (
        _.find(
          this.resourceAcessBus$.value.organizations,
          (org) => org.organization_id === id
        ) || {}
      );
    } else if (type === 'chapter') {
      return _.find(
        this.resourceAcessBus$.value.chapters,
        (chapter) => chapter.chapter_id === id
      );
    }
    return {};
  }

  getIAMGroup(id: string, type: 'organization' | 'chapter') {
    let iam_group = {} as IIAMGroup;
    if (id) {
      const resourceAccess = this.getResourceAcess(id, type);
      if (resourceAccess) {
        iam_group = resourceAccess.iam_group;
      }
    }
    return iam_group;
  }

  getValidatedIAMGroups(
    id: string,
    type: 'organization' | 'chapter',
    listIAMGroups: IIAMGroup[]
  ) {
    if (id) {
      const myIamGroupLevel = this.getIAMGroup(id, type)?.level || 0;

      if (listIAMGroups && listIAMGroups.length) {
        //flag disable group if you dont have permission
        _.forEach(listIAMGroups, (group) => {
          if ((group?.level || 0) > myIamGroupLevel) {
            group['disabled'] = true;
          }
          return group;
        });

        let myIamGroups = listIAMGroups;

        if (myIamGroups && myIamGroups.length) {
          //translate, order groups
          myIamGroups = _.forEach(
            _.orderBy(myIamGroups, 'level', 'desc'),
            (group) => {
              group['name'] = this.translate.instant(
                'SELECT.OPTION.IAM_GROUP.' + group.name
              );
            }
          );
        }

        return myIamGroups;
      }
    }
    return [];
  }
}
