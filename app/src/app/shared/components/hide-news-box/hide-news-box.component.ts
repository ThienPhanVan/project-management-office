import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-hide-news-box',
  templateUrl: './hide-news-box.component.html',
  styleUrls: ['./hide-news-box.component.scss'],
})
export class HideNewsBoxComponent implements OnInit {
  @Input() data: any;

  @Output() undo = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleUndo(id: string) {
    this.undo.emit(id);
  }
}
