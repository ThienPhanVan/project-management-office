import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectVersionsService } from '../../../../../../../services';

@Component({
  selector: 'app-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.scss'],
})
export class VersionListComponent  implements OnInit {
  versions: any = [];
  projectId: string = '';

  constructor(private route: ActivatedRoute, private projectVersionsService: ProjectVersionsService) {
    this.projectId = this.getProjectId();
    this.getVersions()
  }

  ngOnInit() {}

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getVersions() {
    this.projectVersionsService
      .getVersions(this.projectId)
      .subscribe((res) => {
        this.versions = res.data;
      });
  }
}
