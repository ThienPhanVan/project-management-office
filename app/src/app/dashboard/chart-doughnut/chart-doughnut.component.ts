import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart-doughnut',
  templateUrl: './chart-doughnut.component.html',
  styleUrls: ['./chart-doughnut.component.scss'],
})
export class ChartDoughnutComponent implements OnInit {
  @Input()
  chart: any;
  constructor() {}

  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        // labels: ['Data1', 'Data2', 'Data3'],
        datasets: [
          {
            data: [55, 30, 15],
            backgroundColor: ['rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 0.1)'],
          },
        ],
      },
      options: {},
    });
    this.chart.destroy();
  }
}
