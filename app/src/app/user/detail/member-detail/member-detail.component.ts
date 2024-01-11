import { Component, Input, OnInit } from '@angular/core';
import { UserVerifyHistoryService } from '../../../services';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MasterDataService } from '../../../shared/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  @Input() isAdmin: boolean = false;

  userVerifyHistory: any;

  isLoading: boolean = true;
  userRank: number = 0;

  constructor(
    private userVerifyHistoryService: UserVerifyHistoryService,
    private masterDataService: MasterDataService,
    private route: ActivatedRoute
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
    const user_id = this.route.snapshot.paramMap.get('id')?.toString();
    if (!this.isAdmin) {
      this.userVerifyHistoryService
        .getMemberVerifyHistories({ user_id })
        .subscribe((res: any) => {
          this.isLoading = false;
          const data = res.data;
          this.userVerifyHistory = _.find(data, (d) => {
            return moment().isBetween(
              moment(_.get(d, 'from_date'), 'YYYY/MM/DD hh:mm:ss'),
              moment(_.get(d, 'to_date'), 'YYYY/MM/DD hh:mm:ss'),
            );
          });

          // user rank 0 (not a member), 1(member normal), 2(member vip), 3(admin)
          if (_.isNil(this.userVerifyHistory)) {
            this.userRank = 0;
          } else if (this.userVerifyHistory.type === 0) {
            this.userRank = 1;
          } else if (this.userVerifyHistory.type === 1) {
            this.userRank = 2;
          }
        });
    }
    else{
      this.isLoading = false;
      this.userRank = 3;
    }
  }
}
