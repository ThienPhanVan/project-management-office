import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-price-input',
  templateUrl: './price-input.component.html',
  styleUrls: ['./price-input.component.scss'],
})
export class PriceInputComponent implements OnInit {
  inputValue?: string;

  @Input() label: any = '';
  @Input() priceEdit: any;
  @Input() type: any;
  @Output() price: any = new EventEmitter();
  constructor() {}

  ngOnInit() {
    if (this.priceEdit) {
      const formattedValue = this.priceEdit
        .toString()
        .split('')
        .reverse()
        .map((digit: any, index: number) =>
          index % 3 === 0 && index !== 0 ? digit + ',' : digit
        )
        .reverse()
        .join('');
      this.inputValue = formattedValue;
    }
  }
  onPrice(event: any) {
    // let price = event.target.value.replace(/,/g, '');
    let priceValidString = '';
    if (event.target.value === '0') {
      priceValidString = event.target.value;
    } else {
      priceValidString = event.target.value
        .replace(/[a-zA-Z]/g, '')
        .replace(/,/g, '')
        .replace(/\s/g, '')
        .replace(/^0+/, '');
    }

    // console.log(priceValidString);

    const regex = /^\d+$/;
    if (regex.test(priceValidString)) {
      if (priceValidString.length > 15) {
        priceValidString = '999999999999999';
      }
      if (priceValidString.length > 12) {
        if (this.type === 'product') {
          priceValidString = '999999999999';
        }
      }
      if (priceValidString.length < 4) {
        if (this.type === 'product') {
          priceValidString = '1000';
        }
      }
      const formattedValue = priceValidString
        .split('')
        .reverse()
        .map((digit: any, index: number) =>
          index % 3 === 0 && index !== 0 ? digit + ',' : digit
        )
        .reverse()
        .join('');
      this.inputValue = formattedValue;
      this.price.emit(priceValidString);
    } else {
      this.inputValue = '';
      this.price.emit(-1);
    }
  }
}
