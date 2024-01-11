import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { IOrganization } from '../../interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationDataService {
  private organizationDetailBus$ = new BehaviorSubject<IOrganization>({} as IOrganization);
  organizationDetail$ = this.organizationDetailBus$.asObservable();

  private myOrganizationsBus$ = new BehaviorSubject<IOrganization[]>([{} as IOrganization]);
  myOrganizations$ = this.myOrganizationsBus$.asObservable();

  constructor() {}

  setOrganizationDetail(organization: IOrganization) {
    this.organizationDetailBus$.next(organization);
  }

  setMyOrganizations(organizations: IOrganization[]) {
    this.myOrganizationsBus$.next(organizations);
  }
}
