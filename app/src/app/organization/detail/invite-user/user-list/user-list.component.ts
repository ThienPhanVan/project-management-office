import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDetail } from 'src/app/interface/user.interface';
import { IonModal } from '@ionic/angular';
import { IPosition } from '../../../../interface';
@Component({
  selector: 'app-user-list-organization-invite',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListOrganizationInviteComponent implements OnInit {
  @Input() users: UserDetail[] = [];
  @Input() isLoading: boolean = true

  @Output() sendInvite: EventEmitter<UserDetail> = new EventEmitter();
  @Output() getThumbnailUser= new EventEmitter<string>();

  classNameAvatar: string = "list";

  isAvatar: boolean = true;
  
  constructor() {}

  ngOnInit() {}

  actionInvite(user: UserDetail) {
    user['organization_user'] = { ...user['organization_user'], status: 1 };
    this.sendInvite.emit(user);
  }

  actionChangePosition(
    position: IPosition,
    user: UserDetail,
    modalPosition: IonModal
  ) {
    user['organization_user'] = {
      ...user['organization_user'],
      position: position,
      position_id: position.id,
    };
    modalPosition.dismiss();
  }

  getSrcImageUser(thumbnail: string) {
    this.getThumbnailUser.emit(thumbnail)
  }
}
