import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { PolygonsService } from '../../services/polygons.service';
import { MaplegendService } from '../../services/maplegend.service';

@Component({
    selector: 'app-housingmarket',
    templateUrl: 'housingmarket.component.html',
    styleUrls: ['housingmarket.component.scss']
})

export class HousingMarketComponent implements OnInit, OnDestroy {
    public housingMarket;
    public dataforlinearrayMarket;
    public housingMarketConstruction = [];
    public housingStock;
    public newHousing;
    public housingMarketVacancy;
    public xLabel = '';
    public yLabel = '';
    public linecontainer = 'housingmarketchartcontainer';
    public geoJson = '';
    public extentData = [];
    public extent = [];
    public yMarketDataFormat = '';
    // for legend
    public maplegend = {
        title: 'Price levels',
        backgrounds: [
            'rgb(255, 255, 96)',
            'rgb(249, 184, 66)',
            'rgb(249, 140, 66)',
            'rgb(249, 79, 66)'],
        labels: ['low', 'high']
    };

    constructor(private municipality: GetMunicipalityService,
        private mapService: MapService,
        private polygonsService: PolygonsService,
        private mapLegendService: MaplegendService
    ) {
        this.housingMarket = this.municipality.requestData('housingMarket');
        this.housingMarketConstruction = this.municipality.requestData('housingMarketConstructionActivity');
        this.housingMarketVacancy = this.municipality.requestData('housingMarketVacancy');
        this.mapLegendService.setLegendInfo(this.maplegend);
    }

    public ngOnInit() {
        this.dataforlinearrayMarket = this.housingMarket.map((el) => {
            return { year: el.publishDate.toString().substring(0, 4), value: Math.floor(el.municipalityValue) };
        });
        this.housingStock = this.housingMarketConstruction[0].municipalityValue;
        this.newHousing = this.housingMarketConstruction[1].municipalityValue;

        this.displayPolygons();
    }
    ngOnDestroy() {
        this.mapLegendService.removeLegend();
        this.mapService.map.data.setMap(null);
    }

    public displayPolygons() {
        this.mapService.map.data.forEach((feature) => {
            this.mapService.map.data.remove(feature);
        });
        this.geoJson = this.municipality.requestData('polygons');
        this.mapService.map.data.addGeoJson(this.geoJson);
        this.mapService.map.data.setMap(this.mapService.map);

        this.polygonsService.zoom(this.mapService.map);

        this.mapService.map.data.forEach((feature) => {
            this.extentData.push(feature.f.privateRealEstatePriceIndexValue);
        });

        this.extent.push(Math.min.apply(null, this.extentData));
        this.extent.push(Math.max.apply(null, this.extentData));

        this.mapService.map.data.setStyle((feature) => {
            const priceMarket = feature.f.privateRealEstatePriceIndexValue;
            return {
                fillColor: this.polygonsService.calcColor(priceMarket, this.extent),
                strokeWeight: 0.5,
                strokeColor: 'rgb(249, 79, 66)'
            };
        });
    }
}
