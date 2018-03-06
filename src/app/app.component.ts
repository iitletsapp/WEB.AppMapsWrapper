import { Component, OnInit, ViewEncapsulation, OnChanges, NgZone } from '@angular/core';
import { MapService } from '../services/map.service';
import { GetMarkerService } from '../services/getmarker.service';
import { ProgressBarService } from '../services/progressbar.service';
import { NNService } from '../services/nearestneighbour.service';
import { MicroService } from '../services/micro.service';
import { } from '@types/googlemaps';
import * as _ from 'lodash';
import * as d3 from 'd3';
import{ Globals} from '../app/globals';
import { Config } from './appconfig/config';
import { global } from '@angular/core/src/util';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'iazi-map-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit {

  public progressbarValue: number = 0;
  public lat: number = 46.8114741;
  public lng: number = 8.1084209;
  public zoom: number = 7;
  public markerLastLocation: any;
  public map: any;
  public marker: any;
  public infowindow: any;
  public info;
  public prices = [];
  public squaremeterprices = [];
  public living;

  constructor(
    private mapService: MapService,
    private getMarker: GetMarkerService,
    private progressbar: ProgressBarService,
    private micro: MicroService,
    private nnservice: NNService,
    private ngZone:NgZone,
    public global:Globals) {
    getMarker.changeEmitted$.subscribe(
      (data) => {
        this.markerLastLocation = data;
        this.mapService.map.setCenter({ lat: this.markerLastLocation[0], lng: this.markerLastLocation[1] });
        this.mapService.map.setZoom(15);
        this.marker.setPosition({ lat: this.markerLastLocation[0], lng: this.markerLastLocation[1] });
        this.marker.setAnimation(google.maps.Animation.DROP);
      });
    progressbar.changeEmitted$.subscribe(
      (value) => {
        this.progressbarValue = this.progressbar.progressbarValue;
      });
  }

  public ngOnInit() {
    window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};
    window.my.namespace.publicFunc = this.publicFunc.bind(this);
    window.my.namespace.microQuality = this.microQuality.bind(this);
    window.my.namespace.setApiKey = this.setApiKey.bind(this);
    window.my.namespace.quality = this.global.microQuality;

    // we need a global map. This is why we need to return it to the mapservice and make it everywhere.
    this.mapService.startMapsAPI(() => {
      this.map = new google.maps.Map(document.getElementById('googlemap'), {
        center: { lat: this.lat, lng: this.lng },
        zoom: this.zoom,
        styles: [
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#46bcec"
              },
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              },
              {
                "lightness": 21
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ],
      });
      const icon = {
        url: Config.LAGECHECKASSETPATH + '/assets/img/house-small.png'
      };
      this.marker = new google.maps.Marker(<any>{
        icon,
        map: this.map
      });
      this.infowindow = new google.maps.InfoWindow();
      return this.map;
    });

  }

  ngOnDestroy() {
    window.my.namespace.publicFunc = null;
    window.my.namespace.microQuality = null;
    window.my.namespace.setApiKey = null;
    window.my.namespace.quality = null;
  }

  public publicFunc(language:string) {
    this.ngZone.run(() => this.privateFunc(language));
  }

  private privateFunc(language:string) {
    console.log('Called from JS Wrapper');
    this.global.language = language;
    window.my.namespace.quality = this.global.microQuality;
    console.log(this.global.language);  }

  public microQuality(quality:any) {
    this.ngZone.run(() => this.privatemicroQuality(quality));
  }

  private privatemicroQuality(quality:any){
    console.log('Called from MicroQuality')
    console.log('MicroQuality :' + this.global.microQuality);
    //return this.globals.microQuality;
  }

  public setApiKey(apiKey: string) 
  { 
    this.ngZone.run(() => this.privateSetApiKey(apiKey)); 
  } 
  
  private privateSetApiKey(apiKey: string) 
  { 
    this.global.apiKey = apiKey; 
    console.log('API key: ' + this.global.apiKey); 
  }


}

