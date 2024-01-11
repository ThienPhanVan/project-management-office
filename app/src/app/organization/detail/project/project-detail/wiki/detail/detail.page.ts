import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectWikiService } from '../../../../../../services/project-wiki.service';
import { ProjectWikiDataService } from '../../../../../../shared/services/project-wiki-data.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id: string;
  wiki: any = {};

  constructor(
    private route: ActivatedRoute,
    private projectWikiService: ProjectWikiService,
    private projectWikiDataService: ProjectWikiDataService,
    private location: Location
  ) {
    this.id = this.getWikiId();
  }

  ngOnInit() {
    this.getWikiDetail();
    this.wikiSubscribe();
  }

  wikiSubscribe() {
    this.projectWikiDataService.myWikiDetail$.subscribe((res) => {
      this.wiki = res;
    });
  }

  getWikiDetail() {
    this.projectWikiService.getWiki(this.id).subscribe((res) => {
      this.projectWikiDataService.setMyWikiDetail(res);
    });
  }

  getWikiId() {
    return this.route.snapshot.paramMap.get('wikiId')?.toString() || '';
  }

  goBack() {
    this.location.back();
  }
}
