import { Component, OnInit, Input } from '@angular/core';
import { ActivityService } from 'src/app/services';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  @Input() issueId = '';

  activities: any[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.getActivities();
  }

  getActivities() {
    this.activityService.getActivities({resource_id: this.issueId}).subscribe((res: any) => {
      this.activities = res.data;
    }) 
  }
}
