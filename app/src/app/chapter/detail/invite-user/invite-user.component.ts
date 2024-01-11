import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { numberRegex, emailPattern } from '../../../constant/index';
import { UserService } from 'src/app/services';
import { ListUsers, UserDetail } from 'src/app/interface/user.interface';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invite-user-chapter',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
})
export class InviteUserChapterComponent implements OnInit {
  form: FormGroup;

  label: string = '';

  searchedUsers: UserDetail[] = [];
  users: UserDetail[] = [];

  isSendingMail: boolean = false;
  showMail: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.form = this.initForm();
    this.getUsers();
  }

  initForm() {
    return this.formBuilder.group({
      field: ['', []],
    });
  }

  ngOnInit() {
    this.label = this.translate.instant('PLACEHOLDER.SEARCH');
  }

  getUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.users = res.data;
    });
  }

  onSearchChange() {
    this.searchedUsers = [];
    if (numberRegex.test(this.form.controls['field'].value)) {
      this.userService
        .getUsers({ phone: this.form.controls['field'].value })
        .subscribe(
          (res: ListUsers) => {
            if (res.data && res.data.length > 0) {
              this.searchedUsers = res.data;
            }
          },
          () => {
            this.searchedUsers = [];
          }
        );
    } else if (emailPattern.test(this.form.controls['field'].value)) {
      this.userService.getUsers().subscribe(
        (res: ListUsers) => {
          if (res.data && res.data.length > 0) {
            const filterEmail = res.data.filter(
              (el) => el.email === this.form.controls['field'].value
            );
            this.searchedUsers = filterEmail;
          }
        },
        () => {
          this.searchedUsers = [];
        }
      );
    } else {
      this.searchedUsers = [];
    }
  }
}
