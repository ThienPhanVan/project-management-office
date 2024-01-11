import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { DailyService } from 'src/app/services/daily.service';

@Component({
  selector: 'app-daily-list',
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.scss'],
})
export class DailyListComponent implements OnInit {
  projectId: any = '';
  dailies: any;
  keys: any;

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;
  constructor(
    private dailyService: DailyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getDailies();
  }

  onIonInfinite(ev: any) {
    // this.getDailies();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  getDailies() {
    this.isLoading = true;
    if (this.offset <= this.count) {
      const projectId = this.route.snapshot.paramMap
        .get('projectId')
        ?.toString();

      let params = {
        include: 'user,issues_yesterday,issues_today',
        project_id: projectId,
        limit: this.limit,
        offset: this.offset,
      };

      this.dailyService.getDailies(params).subscribe((res: any) => {
        if (res && res.data) {
          this.isLoading = false;
          this.dailies = _.groupBy(res.data, (day) =>
            new Date(day.updated_date).toDateString()
          );
          this.keys = _.keys(this.dailies).sort(function(a, b){
            const date1: any = new Date(a)
            const date2: any = new Date(b)
            
            return date2 - date1;
        });
          this.offset = this.dailies?.length;
          this.count = +res.paging.count;
        }
      });
    }
  }
}
