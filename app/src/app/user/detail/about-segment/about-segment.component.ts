import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detail-about-segment',
  templateUrl: './about-segment.component.html',
  styleUrls: ['./about-segment.component.scss'],
})
export class AboutSegmentComponent  implements OnInit {
  @Input() user: any = {};
  isAdmin: boolean = false;
  
  constructor() { }

  ngOnInit() {}

}
