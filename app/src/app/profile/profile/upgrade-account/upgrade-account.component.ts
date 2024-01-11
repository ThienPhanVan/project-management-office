import { Component, OnInit } from '@angular/core';
import { UserVerifyHistoryService } from '../../../services';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MasterDataService } from '../../../shared/services';

@Component({
  selector: 'app-upgrade-account',
  templateUrl: './upgrade-account.component.html',
  styleUrls: ['./upgrade-account.component.scss'],
})
export class UpgradeAccountComponent implements OnInit {
  isLoading: boolean = true;

  userRank: number = 0;
  userVerifyHistory: any;

  bankAccount = {
    name: 'Công ty Cổ phần Đầu tư Công nghệ TST ECO',
    number: '6206888888',
    bank: 'MB Bank',
  };

  supportAccount = {
    name: 'Đàm Vĩnh Tâm',
    phone: '0965504446',
  };

  constructor(
    private userVerifyHistoryService: UserVerifyHistoryService,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit() {
    this.getMe();
  }

  getMe() {
    this.masterDataService.me$.subscribe(() => {
      this.getUserVerified();
    });
  }

  getUserVerified() {
    const user_id = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    this.userVerifyHistoryService
      .getMemberVerifyHistories({ user_id })
      .subscribe((res: any) => {
        this.isLoading = false;
        const data = res.data;
        this.userVerifyHistory = _.find(data, (d) => {
          return moment().isBetween(
            moment(_.get(d, 'from_date'), 'YYYY/MM/DD hh:mm:ss'),
            moment(_.get(d, 'to_date'), 'YYYY/MM/DD hh:mm:ss')
          );
        });

        // user rank 0 (not a member), 1(member normal), 2(member vip)
        if (_.isNil(this.userVerifyHistory)) {
          this.userRank = 0;
        } else if (this.userVerifyHistory.type === 0) {
          this.userRank = 1;
        } else if (this.userVerifyHistory.type === 1) {
          this.userRank = 2;
        }
      });
  }
}
