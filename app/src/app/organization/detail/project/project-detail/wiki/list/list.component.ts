import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ProjectWikiService } from '../../../../../../services/project-wiki.service';
import { ProjectWikiDataService } from '../../../../../../shared/services/project-wiki-data.service';

@Component({
  selector: 'app-wiki-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class WikiListComponent implements OnInit {
  @Input() wikis: any[] = [];
  @Input() currentLevel: number = 0;
  
  levelRange: number = 2;

  projectId: string = '';

  constructor(
    private projectWikiService: ProjectWikiService,
    private projectWikiDataService: ProjectWikiDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectId = this.getProjectId();
  }

  ngOnInit() {
    if (!this.wikis?.length) {
      this.getWikis();
      this.wikisSubscribe()
    }
    else{
      this.setWikiVisible();
    }
  }

  wikisSubscribe() {
    this.projectWikiDataService.myWikis$.subscribe((res) => {
      this.wikis = res;
      if(this.wikis && this.wikis.length){
        this.setWikiVisible();
      }
    });
  }

  redirectChildCreatePage(parentId: string){
    this.router.navigate([this.router.url + '/create'],{ queryParams: {parent_id: parentId}});
  }

  getWikis() {
    this.projectWikiService
      .getWikis(this.projectId, { include: 'children,grandchildren' })
      .subscribe((res) => {
        this.projectWikiDataService.setMyWikis(res.data);
      });
  }

  setWikiVisible() {
    _.forEach(this.wikis, (wikis) => {
      return (wikis.visible = true);
    });
  }

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  toggleChildren(wiki: any) {
    wiki.visible = !wiki.visible;
  }
}
