import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { MapService } from '../../services/map.service';
import { PolygonsService } from '../../services/polygons.service';
import { MaplegendService } from '../../services/maplegend.service';

declare var require: any;
const gjfilter = require('geojson-filter');

@Component({
  selector: 'app-population',
  templateUrl: './population.component.html',
  styleUrls: ['./population.component.scss']
})

export class PopulationComponent implements OnInit, OnDestroy {
  public population;
  public populationrate;
  public populationratio;
  public populationage;
  public foreignerquota;
  public unemploymentrate;
  public incometaxperson;
  public populationgrowth;
  // linechart
  public linecontainer = 'populationlinechart';
  public barcontainer = 'populationbarchart';
  public dataforlinearray;
  public dataforbararray;
  public xLabel = 'population';
  public xLabel1 = 'population1';
  public xAgeData  = 'ageGroup';
  public yAgeData = 'value';
  public xAxisAgeText = 'age group';
  public yAxisAgeText = 'value in %';

  public xAgeDataFormat = '%';
  public yAgeDataFormat = '%';
  //public displayXAgeData = true;
  public geoJson = '';
  public extentData = [];
  public extent = [];

  // for legend
  public maplegend = {
    title: 'Population density',
    backgrounds: [
      'rgb(255, 255, 96)',
      'rgb(249, 184, 66)',
      'rgb(249, 140, 66)',
      'rgb(249, 79, 66)'],
    labels: ['low', 'high']
  };

  constructor(
    private municipality: GetMunicipalityService,
    private mapService: MapService,
    private polygonsService: PolygonsService,
    private mapLegendService: MaplegendService
  ) {
    this.population = this.municipality.requestData('population');
    this.populationratio = this.municipality.requestData('populationratio');
    this.populationage = this.municipality.requestData('populationage');
    this.mapLegendService.setLegendInfo(this.maplegend);
  }

  public ngOnInit() {
    this.dataforlinearray = this.population.map((el) => {
      return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
    });

    this.dataforbararray = this.populationage.map((el) => {
      return {ageGroup: el.ageGroupText.toString(),  value: el.value };
    });

    console.log(this.dataforbararray);

    this.populationrate = this.populationratio[0].municipalityValue;
    this.foreignerquota = this.populationratio[2].municipalityValue;
    this.unemploymentrate = this.populationratio[4].municipalityValue;
    this.incometaxperson = Math.floor(this.populationratio[3].municipalityValue);
    this.populationgrowth = this.populationratio[1].municipalityValue;

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
      this.extentData.push(feature.f.populationDensity);
    });

    this.extent.push(Math.min.apply(null, this.extentData));
    this.extent.push(Math.max.apply(null, this.extentData));

    this.mapService.map.data.setStyle((feature) => {
      const populationDesity = feature.f.populationDensity;
      return {
        fillColor: this.polygonsService.calcColor(populationDesity, this.extent),
        strokeWeight: '0.5',
        strokeColor: 'rgb(249, 79, 66)'
      };
    });
  }
}
