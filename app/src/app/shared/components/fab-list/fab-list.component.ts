import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDataService } from '../../services';

@Component({
  selector: 'app-fab-list',
  templateUrl: './fab-list.component.html',
  styleUrls: ['./fab-list.component.scss'],
})
export class FabListComponent implements OnInit {
  @Input() buttons: any[] = [];
  @Input() page: string = '';

  @Output() type = new EventEmitter();

  isHidden = true;
  language : any;

  constructor(private route: Router, private newsDataService: NewsDataService) {
    this.newsDataService.myLanguage$.subscribe((res) => {
      this.language = res;
    })
  } 

  ngOnInit() { 
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.language = JSON.parse(userStr).language ?? 'vi';
    }
  }

  addType(type: string) {
    this.type.emit(type);
  }
}
