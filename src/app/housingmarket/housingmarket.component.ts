import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';

@Component({
    selector: 'app-housingmarket',
    templateUrl: 'housingmarket.component.html',
    styleUrls: ['housingmarket.component.scss']
})

export class HousingMarketComponent implements OnInit {

    constructor(private mapService: MapService) { }

    public ngOnInit() {
       
    }
}