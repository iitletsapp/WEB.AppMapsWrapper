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
  public dataforlinearray;
  public dataforbararray;
  public xLabel = 'population';
  public geoJson = '';
  public extentData = [];
  public extent = [];

  constructor(
    private municipality: GetMunicipalityService,
    private mapService: MapService
  ) {
    this.population = this.municipality.requestData('population');
    this.populationratio = this.municipality.requestData('populationratio');
    // this.populationage = this.municipality.requestData('populationage');
  }

  public ngOnInit() {
    this.dataforlinearray = this.population.map((el) => {
      return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
    });

    // this.dataforbararray = this.populationage.map((el) => {
    //   return { value: el.value, ageGroup: el.ageGroupText.toString().substring(0, 4) };
    // });

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

    this.zoom(this.mapService.map);

    this.mapService.map.data.forEach((feature) => {
      this.extentData.push(feature.f.populationDensity);
    });

    this.extent.push(Math.min.apply(null, this.extentData));
    this.extent.push(Math.max.apply(null, this.extentData));

    this.mapService.map.data.setStyle((feature) => {
      const populationDesity = feature.f.populationDensity;
      return {
        fillColor: this.calcColor(populationDesity),
        strokeWeight: '2px',
        strokeColor: this.calcColor(populationDesity)
      };
    });
  }

  public zoom(map) {
    const bounds = new google.maps.LatLngBounds();
    map.data.forEach((feature) => {
      this.processPoints(feature.getGeometry(), bounds.extend, bounds);
    });
    map.fitBounds(bounds);
  }

  public processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach((g) => {
        this.processPoints(g, callback, thisArg);
      });
    }
  }

  public calcColor(val) {
    const quant = d3.scaleQuantize()
      .domain(this.extent)
      .range([
        '#FFFF6B',
        '#FAC04B',
        '#FA974B',
        '#FA5A4B'])
      .nice();
    return quant(val);
  }
}
