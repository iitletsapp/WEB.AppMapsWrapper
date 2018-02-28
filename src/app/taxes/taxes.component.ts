import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../charts/bar-chart/barchart.component';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})

export class TaxesComponent implements OnInit {
  public barchart: string = 'barchart';
  @ViewChild('BarChartComponent') bar: BarChartComponent;
  constructor() { }

  public ngOnInit() { }

}

