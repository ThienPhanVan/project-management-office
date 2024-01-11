import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services';
import { Location } from '@angular/common';
import { MetaDataService } from '../../../shared/services/meta-data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  @Input() organizationId: string = 'efe87002-8bc2-4306-9db6-205b487abba6';
  projects: any[] = [];

  limit = 10;
  offset = 0;
  count = 0;
  isLoading: boolean = true;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private metaDataService: MetaDataService
  ) {}

  ngOnInit() {
    this.getProjects();
  }
  goBack() {
    this.location.back();
  }

  getProjects() {
    if (this.offset <= this.count) {
      this.projectService
        .getProjects({
          organization_id: this.organizationId,
          limit: this.limit,
          offset: this.offset,
        })
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
