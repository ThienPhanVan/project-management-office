import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NOT_FOUND } from '../../constant';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
})
export class PageNotFoundPage implements OnInit {
  image: any = NOT_FOUND;
  constructor(private router: Router) {}

  ngOnInit() {}

  goHome() {
    this.router.navigate(['/tabs', 'home']);
  }
}
