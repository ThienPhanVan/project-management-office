import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-address-shipping-create',
  templateUrl: './address-shipping-create.component.html',
  styleUrls: ['./address-shipping-create.component.scss'],
})
export class AddressShippingCreateComponent implements OnInit {
  @Input() data: any;
  @Input() type: string = '';

  @Output() closeCreateAddress = new EventEmitter();
  @Output() getAddress = new EventEmitter();

  disabled: boolean = true;
  address: any;

  constructor() {}

  ngOnInit(): void {}

  //delivery address
  inputAddress(ev: any) {
    if (ev.target.value === '') {
      this.disabled = true;
    } else {
      this.address = ev;
      this.disabled = false;
    }
  }

  onCloseModal(value: boolean) {
    this.closeCreateAddress.emit(value);
  }

  submit() {
    this.getAddress.emit({ event: this.address, data: this.data });
  }
}
