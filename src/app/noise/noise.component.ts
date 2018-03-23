import { Component, OnInit, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { MicroService } from '../../services/micro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { ProgressBarService } from '../../services/progressbar.service';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { Globals } from '../globals';
import { MaplegendService } from '../../services/maplegend.service';
import { MacroService } from '../../services/macro.service';

@Component({
  selector: 'app-noise',
  templateUrl: './noise.component.html',
  styleUrls: ['./noise.component.scss']
})
export class NoiseComponent implements OnInit, OnDestroy, AfterViewInit {

  public streetnoiseval: number;
  public decibel = {
    streetNoise: null,
    railNoise: null,
    planeNoise: null
  };
  public generalNoise = {
    streetnoise: null,
    railnoise: null,
    planenoise: null
  };
  public testnoise;
  public coordvalues;
  public streetnoisemarker = [];
  public railnoisemarker = [];
  public planenoisemarker = [];
  public loading = false;
  public hasPlane = false;

  // for legend
  public legend = {
    title: 'Noise level',
    backgrounds: [
      'rgb(65, 224, 242)',
      'rgb(46, 232, 25)',
      'rgb(239, 236, 71)',
      'rgb(255, 188, 102)',
      'rgb(224, 25, 11)'],
    labels: ['low', 'high']
  };
  private isloaded = false;
  private mapEventListener;


  constructor(
    private progressbar: ProgressBarService,
    private apiobj: GetMunicipalityService,
    private mapService: MapService,
    private getmarker: GetMarkerService,
    private micro: MicroService,
    private macroService: MacroService,
    private ngZone: NgZone,
    private mapLegendService: MaplegendService,
    public global: Globals) {

    this.mapLegendService.setLegendInfo(this.legend);

    const hasPlaneCheck = this.apiobj.requestData('hasplanenoise');
    hasPlaneCheck !== undefined ? this.hasPlane = hasPlaneCheck : this.hasPlane = this.hasPlane;

    const decibelValues = this.apiobj.requestData('decibel');
    decibelValues !== undefined ? this.decibel = this.apiobj.requestData('decibel') : this.decibel = this.decibel;
  }

  public ngOnInit() {

  }
  public ngAfterViewInit() {
    const layersId = ['streetnoise', 'railnoise', 'planenoise'];
    layersId.forEach((el) => {
      if (this.apiobj.requestData(el) !== undefined) {
        this.generalNoise[el] = this.apiobj.requestData(el);
        this.coordvalues = this.generalNoise[el][0].values;
        this.addLayer(el);
      }
    });
  }
  public ngOnDestroy() {
    const markers = ['streetnoisemarker', 'railnoisemarker', 'planenoisemarker'];
    markers.forEach((el) => {
      for (const circle of this[el]) {
        circle.setMap(null);
      }
    });
    this.mapLegendService.removeLegend();
  }

  public getLayer(e) {
    e.stopPropagation();
    const suffix = `${e.target.id}marker`;
    if (e.target.checked) {
      this.fitZoomLevel(this[suffix]);
      this[suffix].forEach(circle => {
        circle.setOptions({ fillOpacity: .9 });
      });
    } else {
      this[suffix].forEach(circle => {
        circle.setOptions({ fillOpacity: 0 });
      });
    }

  }
  public addLayer(target) {
    this.loading = !this.loading;

    const extent = d3.extent(this.coordvalues.map((el) => el.factorValue));

    for (let i = 0; i < this.coordvalues.length; i++) {
      const value = this.coordvalues[i].factorValue;
      const place = { lat: this.coordvalues[i].latitude, lng: this.coordvalues[i].longitude };
      const circle = new google.maps.Circle({
        strokeWeight: 0,
        fillOpacity: 0,
        fillColor: calcColor(value),
        map: this.mapService.map,
        center: place,
        radius: <any>this.normalizeValues(value) * 6.7 // 5.5 original
      });
      if (target === 'streetnoise') {
        this.streetnoisemarker.push(circle);
      } else if (target === 'railnoise') {
        this.railnoisemarker.push(circle);
      } else if (target === 'planenoise') {
        this.planenoisemarker.push(circle);
      }
    }

    function calcColor(val) {
      const quant = d3.scaleQuantize()
        .domain([0, 110])
        .range([
          'rgb(65, 224, 242)',
          'rgb(48, 224, 124)',
          'rgb(46, 232, 25)',
          'rgb(175, 231, 51)',
          'rgb(239, 236, 71)',
          'rgb(247, 203, 78)',
          'rgb(255, 188, 102)',
          'rgb(245, 136, 70)',
          'rgb(223, 38, 22)'])
        .nice();
      return quant(val);
    }

    const suffix = `${target}marker`;
    this.fitZoomLevel(this[suffix]);
    this.loading = !this.loading;

  }

  public fitZoomLevel(markers) {
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getCenter());
    }
    this.mapService.map.fitBounds(bounds);
  }

  public removeCircles(e) {
    if (e.target.id === 'streetnoise') {
      for (let i = 0; i < this.streetnoisemarker.length; i++) {
        this.streetnoisemarker[i].setMap(null);
      }
    } else if (e.target.id === 'railnoise') {
      for (let i = 0; i < this.railnoisemarker.length; i++) {
        this.railnoisemarker[i].setMap(null);
      }
    } else if (e.target.id === 'planenoise') {
      for (let i = 0; i < this.planenoisemarker.length; i++) {
        this.planenoisemarker[i].setMap(null);
      }
    }
  }
  public normalizeValues(val) {
    // this function normatizes the values otherwise the size for the points are too big to be presented
    const extent = d3.extent(this.coordvalues.map((el) => el.factorValue));
    const quant = d3.scaleQuantize()
      .domain(extent)
      .range([1.1, 1.2, 1.3, 1.4, 1.5]);
    return quant(val);
  }
}
