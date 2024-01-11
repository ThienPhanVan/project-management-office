import { NavigationExtras, Router } from '@angular/router';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { UserDetail } from '../../../interface/user.interface';
import { GroupService } from 'src/app/services/group.service';
import { AlertDialog } from 'src/app/interface';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

interface User {
  id: string;
  username: string;
}

@Component({
  selector: 'app-user-chip-list',
  templateUrl: './user-chip-list.component.html',
  styleUrls: ['./user-chip-list.component.scss'],
})
export class UserChipListComponent implements OnInit {
  @Input() users: UserDetail[] = [];
  @Output() userRemoved: EventEmitter<string> = new EventEmitter();

  @Input() set selectedUserIds(ids: string[]) {
    this._selectedUserIds = ids;
  }
  @Input() groupName: string = '';

  user!: User;

  private _selectedUserIds: string[] = [];

  constructor(
    private groupService: GroupService,
    private cdr: ChangeDetectorRef,
    private router : Router,
    private alertController : AlertController,
    private translate : TranslateService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    if (!this.groupName.trim()) {
      this.groupName = 'Group chưa đặt tên';
    }
  }

  userRemove(userId: any) {
    this._selectedUserIds = this._selectedUserIds.filter((id) => id !== userId);
    this.userRemoved.emit(userId);
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {}

  createGroup() {
    this._selectedUserIds = this.users.map(user => user.id);
  
    if (this._selectedUserIds.length < 2) {
      let alertDialog = {
        header: this.translate.instant('NOTIFICATION.HEADER'),
        message: this.translate.instant('TAB.MESSAGE.NOT_ENOUGH_MEMBER'),
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
          },
        ],
      };
  
      this.presentAlert(alertDialog);
    } else {
      const groupData = {
        "name": this.groupName,
        "description": 'Mô tả không có',
        "parent_id": null,
        "member_ids": this._selectedUserIds,
      };
  
      this.groupService.createGroup(groupData).subscribe(
        (res) => {
          const navigationExtras: NavigationExtras = {
            state: { item: res }
          };
  
          this.router.navigate(['/group', res.id], navigationExtras);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  

  async presentAlert(alertDialog: AlertDialog) {
    const alert = await this.alertController.create({
      header: alertDialog.header,
      subHeader: alertDialog.subHeader,
      message: alertDialog.message,
      buttons: alertDialog.buttons,
    });

    await alert.present();
  }
  
}
