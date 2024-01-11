import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.page.html',
  styleUrls: ['./advertisement.page.scss'],
})
export class AdvertisementPage implements OnInit {

  constructor(
    private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
