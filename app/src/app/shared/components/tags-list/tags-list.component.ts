import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
})
export class TagsListComponent implements OnInit {

  @Input() tags: any[] = [];

  constructor() {};

  ngOnInit() {};

}
