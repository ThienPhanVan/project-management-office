import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services';
import { HistoryDetail, ListHistory } from '../../interface/user.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-history-login',
  templateUrl: './history-login.page.html',
  styleUrls: ['./history-login.page.scss'],
})
export class HistoryLoginPage implements OnInit {
  data: any = [];
  username = '';
  isLoading: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');

    if (userStr) {
      this.username = JSON.parse(userStr).username;
    }
    this.userService.getListHistories().subscribe((res) => {
      if (res.data.length) {
        this.data = res.data.map((el) => {
          return {
            ...el,
            info: JSON.parse(el.info),
            updated_date: moment(el.updated_date).format('DD/MM/YYYY hh:mm'),
          };
        });
        this.isLoading = false;
      }
    });
  }
}
