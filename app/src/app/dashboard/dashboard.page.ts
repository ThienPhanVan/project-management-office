import { Component, OnInit } from '@angular/core';

import { MasterDataService } from '../shared/services/master-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  me: any;
  doughnutCharts: any = {
    data: [
      {
        category: 'Advertising',
        numbers: [5, 15, 30, 35, 15],
        labels: ['Google', 'Facebook', 'Instagram', 'Amazon', 'YouTube'],
        colors: ['#E15D44', '#55B4B0', '#DFCFBE', '#9B2335', '#5B5EA6'],
      },
    ],
  };

  constructor(private masterDataService: MasterDataService) {
    this.masterDataService.me$.subscribe((res: any) => {
      this.me = res;
    });
  }

  ngOnInit() {}
}
