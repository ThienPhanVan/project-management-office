import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-version-change',
  templateUrl: './version-change.component.html',
  styleUrls: ['./version-change.component.scss'],
})
export class VersionChangeComponent implements OnInit {
  @Input() version: string = '';
  @Output() onVersionChange = new EventEmitter();

  isOpen: boolean = false;

  constructor() {}

  ngOnInit() {
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  actionSubmit() {
    this.onVersionChange.emit(this.version);
  }
}
