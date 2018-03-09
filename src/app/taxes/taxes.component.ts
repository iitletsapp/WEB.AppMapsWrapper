import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../charts/bar-chart/barchart.component';
import { GetMunicipalityService } from '../../services/getmunicipality.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})

export class TaxesComponent implements OnInit {
 public tax;
 public dataforbarchart;
 public barchartcontainer = 'taxesbarchart';

  public barchart: string = 'barchart';
  @ViewChild('BarChartComponent') bar: BarChartComponent;
  constructor(  private municipality: GetMunicipalityService ) 
      {
        this.tax = this.municipality.requestData('tax');
      }

  public ngOnInit() {
    this.dataforbarchart = this.tax.map((el) => { 
      return { name: el.what, value: Math.floor(el.municipalityValue) };
    });
   }

}

