import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BarChartComponent } from '../charts/bar-chart/barchart.component';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { MapService } from '../../services/map.service';
import { PolygonsService } from '../../services/polygons.service';
import { MaplegendService } from '../../services/maplegend.service';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})

export class TaxesComponent implements OnInit, OnDestroy {

 public tax;
 public dataforbarchart;
 public barchartcontainer = 'taxesbarchart';
 public xTaxData = 'name';
 public yTaxData = 'value';
 public xTaxDataFormat = '%';
 public yTaxDataFormat = '%';
 public xAxisTaxText = '';
 public yAxisTaxText = 'yearly tax';
 // public displayXAgeData = false;
 public geoJson = '';
 public extentData = [];
 public extent = [];
  // for legend
  public maplegend = {
    title: 'Tax per capita',
    backgrounds: [
      'rgb(255, 255, 96)',
      'rgb(249, 184, 66)',
      'rgb(249, 140, 66)',
      'rgb(249, 79, 66)'],
    labels: ['low', 'high']
  };

  public barchart = 'barchart';
  @ViewChild('BarChartComponent') bar: BarChartComponent;

  constructor(
    private municipality: GetMunicipalityService,
    private mapService: MapService,
    private polygonsService: PolygonsService,
    private mapLegendService: MaplegendService
  ) {
    this.tax = this.municipality.requestData('tax');
    this.mapLegendService.setLegendInfo(this.maplegend);
  }


  public ngOnInit() {
    this.dataforbarchart = this.tax.map((el) => {
      return { name: el.what, value: Math.floor(el.municipalityValue) };
    });

    this.displayPolygons();
  }
  public ngOnDestroy() {
    this.mapLegendService.removeLegend();
  }

  public displayPolygons() {
    this.mapService.map.data.forEach((feature) => {
      this.mapService.map.data.remove(feature);
    });
    this.geoJson = this.municipality.requestData('polygons');
    this.mapService.map.data.addGeoJson(this.geoJson);
    this.mapService.map.data.setMap(this.mapService.map);

    this.polygonsService.zoom(this.mapService.map);

    this.mapService.map.data.forEach((feature) => {
      this.extentData.push(feature.f.taxableIncomePerCapita);
    });

    this.extent.push(Math.min.apply(null, this.extentData));
    this.extent.push(Math.max.apply(null, this.extentData));

    this.mapService.map.data.setStyle((feature) => {
      const taxCollections = feature.f.taxableIncomePerCapita;
      return {
        fillColor: this.polygonsService.calcColor(taxCollections, this.extent),
        strokeWeight: 1,
        strokeColor: this.polygonsService.calcColor(taxCollections, this.extent)
      };
    });
  }


}

