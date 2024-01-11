import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActivityService } from 'src/app/services';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  projectId: string = '';
  activities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.getProjectActivities();
  }

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;

  getProjectActivities() {
    this.projectId =
      this.route.snapshot.paramMap.get('projectId')?.toString() || '';
    // console.log(this.projectId);

    this.isLoading = true;
    if (this.offset <= this.count) {
      let params = {
        include: 'user_activity',
        project_id: this.projectId,
        limit: this.limit,
        offset: this.offset,
      };

      this.activityService
        .getProjectActivities(params)
        .subscribe((res: any) => {
          this.activities = this.activities.concat(res.data);
          this.isLoading = false;
          this.offset = this.activities?.length;
          this.count = +res.paging.count;
        });
    }
  }

  onIonInfinite(ev: any) {
    this.getProjectActivities();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
