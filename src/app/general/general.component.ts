import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { Globals} from '../globals';
import { MacroService } from '../../services/macro.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from '../../services/map.service';

declare var require:any;
const gjfilter = require ('geojson-filter');

@Component({
    selector: 'app-general',
    templateUrl: 'general.component.html',
    styleUrls: ['general.component.scss']
})

export class GeneralComponent implements OnInit {
    // public response: any;
    public generaldata;
    public muncipalityId;
    public cantonCode;
    public backgroundImg;
    public geoJson ='';
    public filter;

  

    constructor(
        private municipality: GetMunicipalityService,
        public global: Globals,
        public macro: MacroService,
        private sanitizer: DomSanitizer,
        private mapService: MapService
    ) {        
        //this.mapService.map.data.setMap(null);

        this.generaldata = this.municipality.requestData('general');
        this.muncipalityId = this.macro.macroObj.municipalityID;
        this.cantonCode = this.generaldata[0].cantonCode;
        this.backgroundImg = sanitizer.bypassSecurityTrustStyle(
            `url(${this.global.lageCheckAssetPath}/assets/img/kantons/${this.cantonCode}.jpg)`
        );

        this.filter = ["in", "municipalityId", `${this.muncipalityId}`];
         this.geoJson = this.municipality.requestData('polygons');
         this.geoJson = gjfilter(this.geoJson,this.filter);
         this.mapService.map.data.addGeoJson(this.geoJson);        
         this.mapService.map.setZoom(this.mapService.map.getZoom() - 6);   
         this.mapService.map.data.setStyle({
          fillColor: '#FA974B',         
          //strokeWeight: '2px',
          strokeColor: '#FA974B'
         // fillOpacity:1.2
        });
    }       

    public ngOnInit() {
    }   



}
