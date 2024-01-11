import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bar-react',
  templateUrl: './bar-react.component.html',
  styleUrls: ['./bar-react.component.scss'],
})
export class BarReactComponent implements OnInit {
  @Output() setReactIcon: EventEmitter<string> = new EventEmitter();

  constructor() {}
  ngOnInit(): void {}

  onReactIcon(value: string) {
    this.setReactIcon.emit(value);
  }
}
