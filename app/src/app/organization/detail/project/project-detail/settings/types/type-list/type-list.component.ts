import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISSUE_TYPES } from '../../../../../../../constant';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss'],
})
export class TypeListComponent implements OnInit {
  types: any = [];
  projectId: string = '';

  constructor(private route: ActivatedRoute) {
    this.projectId = this.getProjectId();
    this.getTypes()
  }

  ngOnInit() {}

  getProjectId() {
    return this.route.snapshot.paramMap.get('projectId')?.toString() || '';
  }

  getTypes() {
    this.types = ISSUE_TYPES;
  }
}
