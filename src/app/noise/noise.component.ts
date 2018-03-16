import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { MicroService } from '../../services/micro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { ProgressBarService } from '../../services/progressbar.service';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { Globals } from '../globals';
import { MaplegendService } from '../../services/maplegend.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-noise',
  templateUrl: './noise.component.html',
  styleUrls: ['./noise.component.scss']
})
export class NoiseComponent implements OnInit, OnDestroy {

  public streetnoiseval: number;
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


  constructor(
    private progressbar: ProgressBarService,
    private apiobj: GetMunicipalityService,
    private mapService: MapService,
    private getmarker: GetMarkerService,
    private micro: MicroService,
    private ngZone: NgZone,
    private mapLegendService: MaplegendService,
    public global: Globals) {
    this.mapLegendService.setLegendInfo(this.legend);
  }

  public ngOnInit() {
    const markers = ['streetnoisemarker', 'railnoisemarker', 'planenoisemarker'];
    markers.forEach((el) => {
      if (this[el]) {
        this.zoomPropertyFunction(this[el]);
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
    if (e.target.checked) {
      this.generalNoise[e.target.id] = this.apiobj.requestData(e.target.id);
      this.coordvalues = this.generalNoise[e.target.id][0].values;
      this.addLayer(e.target.id);
    } else {
      this.removeCircles(e);
    }

  }
  public addLayer(target) {
    this.mapService.map.setZoom(15);
    this.loading = !this.loading;

    const extent = d3.extent(this.coordvalues.map((el) => el.factorValue));

    for (let i = 0; i < this.coordvalues.length; i++) {
      const value = this.coordvalues[i].factorValue;
      const place = { lat: this.coordvalues[i].latitude, lng: this.coordvalues[i].longitude };
      const circle = new google.maps.Circle({
        strokeWeight: 0,
        fillOpacity: 0.8,
        fillColor: calcColor(value),
        map: this.mapService.map,
        center: place,
        radius: <any>this.normalizeValues(value) * 5.5
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
        .domain(extent)
        .range([
          'rgb(65, 224, 242)',
          'rgb(46, 232, 25)',
          'rgb(239, 236, 71)',
          'rgb(255, 188, 102)',
          'rgb(224, 25, 11)'])
        .nice();
      return quant(val);
    }

    const suffix = `${target}marker`;
    this.fitZoomLevel(this[suffix], () => {
      setTimeout(() => {
        this.loading = !this.loading;
      }, 400);
    });

  }

  public fitZoomLevel(markers, cb) {
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getCenter());
    }
    this.mapService.map.fitBounds(bounds);
    cb();
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
    // this function normatizes the values otherwise the size for the points are too wide to present
    const extent = d3.extent(this.coordvalues.map((el) => el.factorValue));
    const quant = d3.scaleQuantize()
      .domain(extent)
      .range([1.1, 1.2, 1.3, 1.4, 1.5]);
    return quant(val);
  }
  public zoomPropertyFunction(noiseCat) {
    setTimeout(() => {
      this.mapService.map.addListener('zoom_changed', () => {
        for (let i = 0; i < noiseCat.length; i++) {
          const p = 21 - this.mapService.map.getZoom();
          const value = this.coordvalues[i].factorValue;
          noiseCat[i].setRadius(<any>(this.normalizeValues(value) * 4) + p);
        }
      });
    }, 300);
  }
}
