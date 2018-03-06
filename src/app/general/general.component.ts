import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { Globals} from '../globals'

@Component({
    selector: 'app-general',
    templateUrl: 'general.component.html',
    styleUrls: ['general.component.scss']
})

export class GeneralComponent implements OnInit {
    // public response: any;
    public generaldata;

    constructor(
        private municipality: GetMunicipalityService,
        private global:Globals
    ) {
        this.generaldata = this.municipality.requestData('general');
    }

    public ngOnInit() { 
    }


}