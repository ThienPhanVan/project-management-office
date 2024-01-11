import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-statuses',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusesPage implements OnInit {

  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}

