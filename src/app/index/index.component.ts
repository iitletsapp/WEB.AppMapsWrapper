import { Component, OnInit, ViewEncapsulation, OnChanges, NgZone } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { ProgressBarService } from '../../services/progressbar.service';
import { NNService } from '../../services/nearestneighbour.service';
import { MicroService } from '../../services/micro.service';
import { } from '@types/googlemaps';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { Globals } from '../../app/globals';
import { Config } from '../appconfig/config';
import { global } from '@angular/core/src/util';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute, Params } from '@angular/router';

/**
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    providers: []
})
export class IndexComponent {

    public progressbarValue = 0;
    public lat = 46.8114741;
    public lng = 8.1084209;
    public zoom = 7;
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
        private ngZone: NgZone,
        public global: Globals,
        public translate: TranslateService,
        private router: Router
    ) {
        getMarker.changeEmitted$.subscribe(
            (data) => {
                this.markerLastLocation = data;
                this.mapService.map.setMapTypeId('satellite');
                this.mapService.map.setCenter({ lat: this.markerLastLocation[0], lng: this.markerLastLocation[1] });
                this.mapService.map.setZoom(19);
                this.marker.setPosition({ lat: this.markerLastLocation[0], lng: this.markerLastLocation[1] });
                this.marker.setAnimation(google.maps.Animation.DROP);
            });
        progressbar.changeEmitted$.subscribe(
            (value) => {
                this.progressbarValue = this.progressbar.progressbarValue;
            });

        // let defaultLang = this.global.language;
        // translate.addLangs(['en', 'de']);
        // translate.setDefaultLang(this.global.language);

        // translate.use(this.global.language);
        // console.log("language=", defaultLang);

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
                // tslint:disable-next-line:max-line-length
                url: (sessionStorage.getItem('iazimappath') === null ? Config.LAGECHECKASSETPATH : sessionStorage.getItem('iazimappath')) + '/assets/img/map-marker.png'
            };
            this.marker = new google.maps.Marker(<any>{
                icon,
                map: this.map
            });
            this.infowindow = new google.maps.InfoWindow();
            return this.map;
        });
    }

    // public ngOnInit() {
    //     window.my = window.my || {};
    //     window.my.namespace = window.my.namespace || {};
    //     window.my.namespace.publicFunc = this.publicFunc.bind(this);
    //     window.my.namespace.microQuality = this.microQuality.bind(this);
    //     window.my.namespace.setApiKey = this.setApiKey.bind(this);
    //     window.my.namespace.quality = this.global.microQuality;
    // }

    // ngOnDestroy() {
    //     window.my.namespace.publicFunc = null;
    //     window.my.namespace.microQuality = null;
    //     window.my.namespace.setApiKey = null;
    //     window.my.namespace.quality = null;
    // }

    // public publicFunc(language: string) {
    //     this.ngZone.run(() => this.privateFunc(language));
    // }

    // private privateFunc(language: string) {
    //     console.log('Called from JS Wrapper');
    //     this.global.language = language;
    //     this.translate.use(this.global.language);
    //     window.my.namespace.quality = this.global.microQuality;
    //     console.log(this.global.language);
    // }

    // public microQuality(quality: any) {
    //     this.ngZone.run(() => this.privatemicroQuality(quality));
    // }

    // private privatemicroQuality(quality: any) {
    //     console.log('Called from MicroQuality')
    //     console.log('MicroQuality :' + this.global.microQuality);
    //     //return this.globals.microQuality;
    // }

    // public setApiKey(apiKey: string) {
    //     this.ngZone.run(() => this.privateSetApiKey(apiKey));
    // }

    // private privateSetApiKey(apiKey: string) {
    //     this.global.apiKey = apiKey;
    //     console.log('API key: ' + this.global.apiKey);
    // }


}

