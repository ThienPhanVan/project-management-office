import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  @Input() organizationId: string = '';
  projects: any[] = [];

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;
  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    if (this.offset <= this.count) {
      this.projectService
        .getProjects({ organization_id: this.organizationId, limit: this.limit, offset: this.offset })
        .subscribe((res: any) => {
          if (res && res.data) {
            this.projects = this.projects.concat(res.data);
            this.offset = this.projects?.length;
            this.count = +res.paging.count;
          }
        });
    }
  }
}
