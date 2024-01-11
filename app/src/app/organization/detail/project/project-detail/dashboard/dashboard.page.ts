import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  projectName: string = '';
  data: any = {};

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.getProjectName();
    this.getTotalIssuesByUser();
  }

  goBack() {
    this.location.back();
  }

  getProjectName() {
    const projectId = this.route.snapshot.paramMap.get('projectId')?.toString();
    if (projectId) {
      this.projectService.getProject(projectId).subscribe((res) => {
        this.projectName = res.name;
      });
    }
  }

  getTotalIssuesByUser() {
    const projectId = this.route.snapshot.paramMap.get('projectId')?.toString();
    if (projectId) {
      this.projectService.getTotalIssuesByUser(projectId).subscribe((res) => {
       this.data = res;
      });
    }
  }
}
