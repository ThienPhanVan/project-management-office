import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  @Input() orders: any = [];

  @Output() order = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  directOrderDetail(data: any) {
    this.order.emit(data);
  }
}
