import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
})
export class DailyPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
