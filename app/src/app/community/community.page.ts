import { Component, OnInit } from '@angular/core';
import { OrganizationsService, UserService } from '../services';
import { ChapterService } from '../services/chapter.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  organizations: any = {
    data: [],
    paging: {
      count: 0,
      litmit: 0,
      offset: 0,
    },
  };
  users: any = {
    data: [],
    paging: {
      count: 0,
      litmit: 0,
      offset: 0,
    },
  };
  chapters: any = {
    data: [],
    paging: {
      count: 0,
      litmit: 0,
      offset: 0,
    },
  };

  campaigns: any = {
    data: [],
    paging: {
      count: 0,
      litmit: 0,
      offset: 0,
    },
  };
  isLoading: boolean = true;
  constructor(
    private organizationService: OrganizationsService,
    private userService: UserService,
    private chapterService: ChapterService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getOrganizationsData();
    this.userService.getUsers().subscribe((res) => {
      this.users = res;
      this.isLoading = false;
    });

    this.chapterService.getChapters().subscribe((res) => {
      this.chapters = res;
      this.isLoading = false;
    });
  }

  getOrganizationsData(query?: any) {
    this.isLoading = true;
    this.organizationService.getOrganizations(query).subscribe((res) => {
      this.organizations = res;
      this.isLoading = false;
    });
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.getOrganizationsData(query);
  }
}
