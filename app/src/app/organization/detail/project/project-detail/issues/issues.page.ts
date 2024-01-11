import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../../services';
import { IssuesService } from '../../../../../services';
import { convertDataNewsList } from 'src/app/constant';
import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular';
import { IIssueData } from 'src/app/interface/issue.interface';
import { IssueDataService } from 'src/app/shared/services';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.page.html',
  styleUrls: ['./issues.page.scss'],
})
export class IssuesPage implements OnInit {
  projectName: string = '';
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.getProjectName();
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
}
