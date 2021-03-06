import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-teaser',
    templateUrl: './teaser.component.html',
    styleUrls: ['./teaser.component.scss']
})
export class TeaserComponent implements OnInit {
    // municipality rating
    public macrofactor;
    public macrofactortext;
    public municipalityname;
    public municipalitytext;
    // address rating
    public addressname;
    public addressfactor;
    public addressfactortext;
    public addresstext;

    public markerLastLocation;
    public loading = false;
    // gauge municipality
    public municipalitygaugedata = this.macrofactor;
    public municipalitygaugeextent = [5, 1];
    public municipalitygaugecontainerId = 'gaugecontainerone';
    public municipalitygaugeclassification;
    public municipalitygaugeminMax = ['', ''];
    public municipalitygaugeminThreshold = .01;
    // gauge address
    public addressgaugedata = this.addressfactor;
    public addressgaugeextent = [5, 1];
    public addressgaugecontainerId = 'gaugecontainertwo';
    public addressgaugeclassification;
    public addressgaugeminMax = ['', ''];
    public addressgaugeminThreshold = .01;
    // barchart
    public layerone = 'onecont';
    public layertwo = 'twocont';

    constructor(
        public progressbar: ProgressBarService,
        private macro: MacroService,
        private address: GetAddressService,
        private getMarker: GetMarkerService,
        private municipality: GetMunicipalityService,
        // private translate: TranslateService,
        public global: Globals

    ) {
        // let defaultLang = 'de';
        // translate.addLangs(['en','de']);
        // translate.setDefaultLang(defaultLang);

        // translate.use(defaultLang );
        // console.log("language=",defaultLang);

        getMarker.changeEmitted$.subscribe(
            (data) => {
                this.progressbar.startProgressBar();
                this.markerLastLocation = data;
                this.getmacro();
            });
    }

    public ngOnInit() {
        //
    }

    public getmacro() {
        this.macro.getMacroRatings(this.markerLastLocation[0], this.markerLastLocation[1]).subscribe((res) => {
            this.loading = !this.loading;
            this.macrofactor = res.results.macroRatingClass1To5;
            this.macrofactortext = res.results.macroRatingClass1To5Text;
            this.municipalitygaugeclassification = [this.macrofactor.toString()];
            const generaldata = this.municipality.requestData('general');
            this.municipalityname = generaldata[0].municipalityName;
            if (this.macrofactor <= 3) {
                this.municipalitytext = 'ranks higher on average.';
            } else {
                this.municipalitytext = 'ranks lower on average.';
            }
            this.progressbar.endProgressBar();
        }, (error) => {
            console.log(error);
        }, () => {
            this.macro.getAddressRatings(this.markerLastLocation[0], this.markerLastLocation[1]).subscribe((res) => {
                this.addressfactor = res.results.microRatingClass1To5;
                this.addressfactortext = res.results.microRatingClass1To5Text;
                this.addressname = this.address.requestAddress();
                this.addressgaugeclassification = [this.addressfactor.toString()];
                if (this.addressfactor <= 3) {
                    this.addresstext = 'this address ranks higher among the average.';
                } else {
                    this.addresstext = 'this address ranks lower among the average.';
                }
            }, (error) => {
                console.log(error);
            }, () => {
                this.loading = !this.loading;
            });
        });
    }

}
