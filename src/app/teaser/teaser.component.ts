import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { TranslateService } from 'ng2-translate';
import { MacroService } from '../../services/macro.service';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { ProgressBarService } from '../../services/progressbar.service';
import { Config } from '../appconfig/config';

@Component({
    selector: 'app-teaser',
    templateUrl: './teaser.component.html',
    styleUrls: ['./teaser.component.scss']
})
export class TeaserComponent implements OnInit {

    public markerLastLocation;
    public macrofactor;
    public macrofactortext;
    public lagecheckpath:string;

    constructor(
        public progressbar: ProgressBarService,
        private macro: MacroService,
        private getMarker: GetMarkerService
    ) {
        getMarker.changeEmitted$.subscribe(
            (data) => {
                this.progressbar.startProgressBar();
                this.markerLastLocation = data;
                this.getmacro();
            });
        this.lagecheckpath = Config.LAGECHECK;
    }

    public ngOnInit() {
        //
    }

    public getmacro() {
        this.macro.getMacroRatings(this.markerLastLocation[0], this.markerLastLocation[1]).subscribe((res) => {
            this.macrofactor = res.results.macroRatingClass1To5;
            this.macrofactortext = res.results.macroRatingClass1To5Text;
            this.progressbar.endProgressBar();
        });
    }

}
