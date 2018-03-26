import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
// import { TranslateService } from 'ng2-translate';
import { MacroService } from '../../services/macro.service';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { ProgressBarService } from '../../services/progressbar.service';
import { Globals } from '../globals';
import { GetAddressService } from '../../services/getaddress.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { GaugeChartComponent } from '../charts/gauge-chart/gauge-chart.component';
import { FeaturereadyService } from '../../services/featureready.service';

@Component({
    selector: 'app-teaser',
    templateUrl: './teaser.component.html',
    styleUrls: ['./teaser.component.scss']
})
export class TeaserComponent implements OnInit, OnDestroy {
    public generaldataReady = false;
    public poiReady = false;
    public noiseReady = false;

    public muncipalityId;
    // municipality rating
    public macrofactor;
    public macrofactortext;
    public municipalityname;
    // address rating
    public addressname;
    public addressfactor;
    public addressfactortext;

    public markerLastLocation;
    public loading = false;
    // gauge municipality
    public municipalitygaugedata = this.macrofactor;
    public municipalitygaugeextent = [5, 1];
    public municipalitygaugecontainerId = 'gaugecontainerone';
    public municipalitygaugeclassification;
    public municipalitygaugeminMax = ['', ''];
    public municipalitygaugeminThreshold = .01;
    public municipalitygaugeimgURL = this.global.lageCheckAssetPath + '/assets/img/icons/generalinfo-grey.svg';
    // gauge address
    public addressgaugedata = this.addressfactor;
    public addressgaugeextent = [5, 1];
    public addressgaugecontainerId = 'gaugecontainertwo';
    public addressgaugeclassification;
    public addressgaugeminMax = ['', ''];
    public addressgaugeminThreshold = .01;
    public addressgaugeimgURL = this.global.lageCheckAssetPath + '/assets/img/icons/map-marker-grey.svg';

    private dataSubscription;

    constructor(
        public progressbar: ProgressBarService,
        private macro: MacroService,
        private address: GetAddressService,
        private getMarker: GetMarkerService,
        private municipalityService: GetMunicipalityService,
        private featureReadyService: FeaturereadyService,
        public global: Globals
    ) {
        const combined = combineLatest(this.getMarker.changeEmitted$, this.macro.changeEmitted$);
        this.dataSubscription = combined.subscribe(
            ([markerdata, macrodata]) => {
                if (markerdata && !_.isEmpty(macrodata)) {
                    this.markerLastLocation = markerdata;
                    this.getmacro(macrodata.municipalityID, macrodata.ortID);
                }
            }
        );
        this.featureReadyService.changeEmitted$.subscribe((state) => {
            this.generaldataReady = state.general;
            this.poiReady = state.poi;
            this.noiseReady = state.noise;
        });

        if ( this.global.macroData !== undefined ) {
            console.log('macrodata');
            this.macrofactor = this.global.macroData.macroRatingClass1To5.toFixed(1);
            this.macrofactortext = this.global.macroData.macroRatingClass1To5Text;
            this.municipalitygaugeclassification = [this.macrofactor.toString()];
            this.muncipalityId = this.global.muncipalityId;
            this.municipalityname = this.municipalityService.apiObj.general[0].municipalityName;
        }

        if ( this.global.addressData !== undefined ) {
            console.log('addressdata');
            this.addressfactor = this.global.addressData.microRatingClass1To5;
            this.addressfactortext = this.global.addressData.microRatingClass1To5Text;
            this.addressgaugeclassification = [this.addressfactor.toString()];
            this.addressname = this.address.requestAddress();
        }
    }

    public ngOnInit() {
        this.generaldataReady = this.featureReadyService.requestFeaturesReadyObject().general;
        this.poiReady = this.featureReadyService.requestFeaturesReadyObject().poi;
        this.noiseReady = this.featureReadyService.requestFeaturesReadyObject().noise;
    }

    public ngOnDestroy() {
       this.dataSubscription.unsubscribe();
    }

    public getmacro(municalityId, ortID) {
        this.loading = true;
        // tslint:disable-next-line:max-line-length
        this.macro.getMacroRatings(this.markerLastLocation[0], this.markerLastLocation[1], municalityId, this.macro.getCulture()).subscribe((res) => {
            this.global.macroData = res.results;
            this.macrofactor = res.results.macroRatingClass1To5.toFixed(1);
            this.macrofactortext = res.results.macroRatingClass1To5Text;
            this.municipalitygaugeclassification = [this.macrofactor.toString()];
        }, (error) => {
            console.log(error);
            this.loading = false;
        }, () => {
            // tslint:disable-next-line:max-line-length
            this.macro.getAddressRatings(this.markerLastLocation[0], this.markerLastLocation[1], ortID, this.macro.getCulture()).subscribe((res) => {
                this.global.addressData = res.results;
                this.addressfactor = res.results.microRatingClass1To5;
                this.addressfactortext = res.results.microRatingClass1To5Text;
                this.addressgaugeclassification = [this.addressfactor.toString()];
            }, (error) => {
                console.log(error);
                this.loading = false;
            }, () => {
                this.muncipalityId = municalityId;
                this.municipalityname = this.municipalityService.apiObj.general[0].municipalityName;
                this.addressname = this.address.requestAddress();
                this.loading = false;

                this.global.muncipalityId = this.muncipalityId;
            });
        });
    }

}
