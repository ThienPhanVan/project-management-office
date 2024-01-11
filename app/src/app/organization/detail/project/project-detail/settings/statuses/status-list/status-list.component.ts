import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectStatusService } from '../../../../../../../services';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss'],
})
export class StatusListComponent  implements OnInit {
  statuses: any = [];
  projectId: string = '';

  constructor(
    private projectStatusService: ProjectStatusService,
    private route: ActivatedRoute,

  ) {
    this.projectId = this.getProjectId();
    this.getStatus()
  }

  ngOnInit() {}

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getStatus() {
    this.projectStatusService
      .getStatuses(this.projectId)
      .subscribe((res) => {
        this.statuses = res.data;
      });
  }
}
