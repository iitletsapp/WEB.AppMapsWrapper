import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { MicroService } from '../../services/micro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { ProgressBarService } from '../../services/progressbar.service';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { Globals} from '../globals'

@Component({
  selector: 'app-noise',
  templateUrl: './noise.component.html',
  styleUrls: ['./noise.component.scss']
})
export class NoiseComponent implements OnInit {

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
  public loading: boolean = false;

  constructor(
    private progressbar: ProgressBarService,
    private apiobj: GetMunicipalityService,
    private mapService: MapService,
    private getmarker: GetMarkerService,
    private micro: MicroService,
    public global:Globals) { }

  public ngOnInit() {
  }

  public getLayer(e) {
    if (e.target.checked) {
    this.generalNoise[e.target.id] = this.apiobj.requestData(e.target.id);
    this.coordvalues = this.generalNoise[e.target.id][0].values;
    this.addLayer(e.target.id);
    }else {
      this.removeCircles(e);
    }

  }
  public addLayer(target) {
    this.loading = !this.loading;

    let extent = d3.extent(this.coordvalues.map((el) => el.factorValue));
    let number1 = d3.quantile(extent, 0.2);
    let number2 = d3.quantile(extent, 0.4);
    let number3 = d3.quantile(extent, 0.6);
    let number4 = d3.quantile(extent, 0.8);

    for (let i = 0; i < this.coordvalues.length; i++) {
      let value = this.coordvalues[i].factorValue;
      let place = { lat: this.coordvalues[i].latitude, lng: this.coordvalues[i].longitude };
      let circle = new google.maps.Circle({
        strokeWeight: 0,
        fillOpacity: 0.7,
        fillColor: calcColor(value),
        map: this.mapService.map,
        center: place,
        radius: value * 0.7
      });
      if (target === 'streetnoise') {
        this.streetnoisemarker.push(circle);
      }else if (target === 'railnoise') {
        this.railnoisemarker.push(circle);
      }else if (target === 'planenoise') {
        this.planenoisemarker.push(circle);
      }
    }

    function calcColor(val) {

      const color = [
        'rgb(65, 224, 242)', 'rgb(46, 232, 25)',
        'rgb(239, 236, 71)', 'rgb(255, 188, 102)',
        'rgb(224, 25, 11)'];

      function colorEvaluation(val) {
        switch (true) {
          case (val <= number1):
            return color[0];
          case (val > number1 && val < number2):
            return color[1];
          case (val >= number2 && val < number3):
            return color[2];
          case (val >= number3 && val < number4):
            return color[3];
          case (val >= number4):
            return color[4];
          default:
            break;
        }
      }
      return colorEvaluation(val);
    }
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1200);
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
    } else if (e.target.id === 'plainenoise') {
      for (let i = 0; i < this.planenoisemarker.length; i++) {
        this.planenoisemarker[i].setMap(null);
      }
    }
  }
}
