import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-product-item',
  templateUrl: './skeleton-product-item.component.html',
  styleUrls: ['./skeleton-product-item.component.scss'],
})
export class SkeletonProductItemComponent  implements OnInit {
  SkeletonData =[1,2,3];
  constructor() { }

  ngOnInit() {}

}
