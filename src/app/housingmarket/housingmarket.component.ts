import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';

@Component({
    selector: 'app-housingmarket',
    templateUrl: 'housingmarket.component.html',
    styleUrls: ['housingmarket.component.scss']
})

export class HousingMarketComponent implements OnInit {
    public housingMarket;
    public dataforlinearrayMarket;  
    public housingMarketConstruction = [];
    public housingStock;
    public newHousing;
    public housingMarketVacancy;
    public xLabel = 'cost';

    constructor(private municipality: GetMunicipalityService) 
    {
        this.housingMarket = this.municipality.requestData('housingMarket');
        this.housingMarketConstruction = this.municipality.requestData('housingMarketConstructionActivity');
        this.housingMarketVacancy = this.municipality.requestData('housingMarketVacancy');
     }

    public ngOnInit() { 
      this.dataforlinearrayMarket = this.housingMarket.map((el) => { 
      return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
    }); 
    this.housingStock = this.housingMarketConstruction[0].municipalityValue;
    this.newHousing = this.housingMarketConstruction[1].municipalityValue; 
    }
}