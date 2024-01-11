import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectMilestonesService } from '../../../../../../../services';

@Component({
  selector: 'app-milestone-list',
  templateUrl: './milestone-list.component.html',
  styleUrls: ['./milestone-list.component.scss'],
})
export class MilestoneListComponent implements OnInit {
  milestones: any = [];
  projectId: string = '';

  constructor(
    private projectMilestonesService: ProjectMilestonesService,
    private route: ActivatedRoute,

  ) {
    this.projectId = this.getProjectId();
    this.getMilestones()
  }

  ngOnInit() {}

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getMilestones() {
    this.projectMilestonesService
      .getMilestones(this.projectId)
      .subscribe((res) => {
        this.milestones = res.data;
      });
  }
}
