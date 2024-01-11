import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectService } from '../../../../services';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.page.html',
  styleUrls: ['./project-detail.page.scss'],
})
export class ProjectDetailPage implements OnInit {
  id: string;
  menuOptions: any = [
    {
      icon: 'analytics-outline',
      name: 'Dashboard',
      route: '/dashboard',
    },
    {
      icon: 'reader-outline',
      name: 'Issues',
      route: '/issues',
    },
    {
      icon: 'cafe-outline',
      name: 'DailyReport',
      route: '/daily',
    },
    {
      icon: 'book-outline',
      name: 'Wiki',
      route: '/wiki',
    },
    {
      icon: 'settings-outline',
      name: 'Settings',
      route: '/settings',
    },
    {
      icon: 'receipt-outline',
      name: 'Activities',
      route: '/activities',
    },
  ];

  project: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private location: Location
  ) {
    this.id = this.getId();
    this.getProject();
  }

  ngOnInit() {}

  getId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getProject() {
    if (this.id) {
      this.projectService.getProject(this.id).subscribe((res) => {
        this.project = res;
      });
    }
  }

  navigate(route: string[]) {
    console.log(route);
    console.log(this.router.url);

    this.router.navigate([this.router.url + route]);
  }

  goBack() {
    this.location.back();
  }
}
