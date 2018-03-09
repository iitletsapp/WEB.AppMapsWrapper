import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { Globals} from '../globals';
import { MacroService } from '../../services/macro.service';
import { DomSanitizer } from '@angular/platform-browser';

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

    constructor(
        private municipality: GetMunicipalityService,
        public global: Globals,
        public macro: MacroService,
        private sanitizer: DomSanitizer
    ) {
        this.generaldata = this.municipality.requestData('general');
        this.muncipalityId = this.macro.macroObj.municipalityID;
        this.cantonCode = this.generaldata[0].cantonCode;
        this.backgroundImg = sanitizer.bypassSecurityTrustStyle(
            `url(${this.global.lageCheckAssetPath}/assets/img/kantons/${this.cantonCode}.jpg)`
        );

    }

    public ngOnInit() {
    }


}
