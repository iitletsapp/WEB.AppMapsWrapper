import { Component, OnInit } from '@angular/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { MapService } from '../../services/map.service';
import * as d3 from 'd3';

declare var require: any;
const gjfilter = require('geojson-filter');

@Component({
  selector: 'app-population',
  templateUrl: './population.component.html',
  styleUrls: ['./population.component.scss']
})

export class PopulationComponent implements OnInit {
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
  public xAgeDataFormat = '%';
  public yAgeDataFormat = '%';
  //public displayXAgeData = true;
  public geoJson = '';
  public extentData = [];
  public minMax = [];

  constructor(
    private municipality: GetMunicipalityService,
    private mapService: MapService
  ) {
    this.population = this.municipality.requestData('population');
    this.populationratio = this.municipality.requestData('populationratio');
    this.populationage = this.municipality.requestData('populationage');
  }

  public ngOnInit() {
    this.dataforlinearray = this.population.map((el) => {
      return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
    });

    this.dataforbararray = this.populationage.map((el) => {
      return {ageGroup: el.ageGroupText.toString().substring(0, 4),  value: el.value };
    });

    console.log(this.dataforbararray);

    this.populationrate = this.populationratio[0].municipalityValue;
    this.foreignerquota = this.populationratio[2].municipalityValue;
    this.unemploymentrate = this.populationratio[4].municipalityValue;
    this.incometaxperson = Math.floor(this.populationratio[3].municipalityValue);
    this.populationgrowth = this.populationratio[1].municipalityValue;

    this.displayPolygons();
  }

  public displayPolygons() {
    this.mapService.map.data.forEach((feature) => {
      this.mapService.map.data.remove(feature);
    });
    this.geoJson = this.municipality.requestData('polygons');
    this.mapService.map.data.addGeoJson(this.geoJson);
    this.mapService.map.data.setMap(this.mapService.map);
    this.mapService.map.setZoom(11);

    this.mapService.map.data.forEach((feature) => {
      this.extentData.push(feature.f.populationDensity);
    });


    this.minMax.push(Math.min.apply(null, this.extentData));
    this.minMax.push(Math.max.apply(null, this.extentData));

    const extent = this.minMax;

    this.mapService.map.data.setStyle(function (feature) {
      const populationDesity = feature.f.populationDensity;
      return {
        fillColor: calcColor(populationDesity),
        strokeWeight: '2px',
        strokeColor: calcColor(populationDesity)
      };
    });

    function calcColor(val) {
      const quant = d3.scaleQuantize()
        .domain(extent)
        .range([
          '#FFFF6B',
          '#FAC04B',
          '#FA974B',
          '#FA5A4B'])
        .nice();
      return quant(val);
    }
  }

}
