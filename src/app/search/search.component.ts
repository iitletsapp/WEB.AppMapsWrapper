import { Component, ElementRef, ViewChild, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { GetAddressService } from '../../services/getaddress.service';
import { ProgressBarService } from '../../services/progressbar.service';
import { } from '@types/googlemaps';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { Globals } from '../globals';
import { MapService } from '../../services/map.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FeaturereadyService } from '../../services/featureready.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

    public address = '';
    public storageAddress: string;
    public autocomplete: any;
    public countryCode = 'CH';
    public lat;
    public lng;
    public searchControl: FormControl;

    @ViewChild('focusable') public searchElementRef: ElementRef;

    constructor(
        private macro: MacroService,
        private ngZone: NgZone,
        private getMarker: GetMarkerService,
        private mapsAPILoader: MapsAPILoader,
        private progressbar: ProgressBarService,
        private getAddress: GetAddressService,
        private apiobj: GetMunicipalityService,
        public global: Globals,
        private mapService: MapService,
        private featureReadyService: FeaturereadyService,
        private router: Router
    ) {
        this.getAddress.changeEmitted$.subscribe((newAddress) => {
            this.address = newAddress;
        });
        this.mapService.sourceMapsChangeEmitted$.subscribe((ready) => this.mapService.map.data.setMap(null));
    }

    public ngOnInit() {

        let autocomplete;
        this.searchControl = new FormControl();
        this.mapsAPILoader.load().then(() => {
            autocomplete = new google.maps.places.Autocomplete(
                this.searchElementRef.nativeElement,
                {
                    componentRestrictions: { country: this.countryCode },
                    types: [] // when emtpy it will search for all types. E.g. streets and shops
                });

            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    // set latitude, longitude and zoom
                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                    this.address = place.formatted_address;
                });
            });
        });
    }

    ngAfterViewInit() {
        console.log('Address : ' + this.global.address);
        this.address = this.global.address;
        this.lat = this.global.lat;
        this.lng = this.global.lon;
        this.goto();
    }

    public goto() {
        if (!this.address) {
            this.global.addressSearch = false;
            return;
        }
        // tslint:disable-next-line:quotemark
        this.router.navigate(['/index', { outlets: { 'index': ['teaser'] } }]);
        this.progressbar.startProgressBar();
        this.global.addressSearch = true;
        setTimeout(() => {
            this.getAddress.setFormatedAddress(this.address);
            this.getMarker.emitChange([this.lat, this.lng]);
            this.progressbar.endProgressBar();
        }, 150);
        this.macro.getLocationInfo(this.lat, this.lng).subscribe(() => {

        }, (error) => {
            console.log(error);
        }, () => {
            console.log('ortId done');
            this.macro.getMunicipalityInfo(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.townInfo, 'general');
            }, (error) => {
                console.log(error);
            }, () => {
                console.log('general done');
                this.featureReadyService.emitIsReady(true, 'poi');
            });
            this.macro.getPopulation(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.municipalityPopulationEvolutionIndex, 'population');
                this.apiobj.emitChange(res.municipalityRatios, 'populationratio');
                this.apiobj.emitChange(res.municipalityAgeGroups, 'populationage');
            }, () => { }, () => console.log('population done'));
            this.macro.getTax(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.municipalityTaxCharge, 'tax');
            }, () => { }, () => console.log('tax done'));
            this.macro.getHousingMarket(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.municipalityPrivateRealEstatePriceIndex, 'housingMarket');
                this.apiobj.emitChange(res.housingAreaMarketConstructionActivity, 'housingMarketConstructionActivity');
                this.apiobj.emitChange(res.housingAreaMarketVacancyRate[0].municipalityValue, 'housingMarketVacancy');
            }, () => { }, () => console.log('housing market done'));
            this.macro.getNoiseDecibel(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.results, 'decibel');
                this.featureReadyService.emitIsReady(true, 'noise');
            }, () => { }, () => console.log('noise decibel done'));
            this.macro.getStreetNoise(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.results.data, 'streetnoise');
            }, () => { }, () => console.log('streetnoise done'));
            this.macro.getRailNoise(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.results.data, 'railnoise');
            }, () => { }, () => console.log('railnoise done'));
            this.macro.getPlaneNoise(this.lat, this.lng).subscribe((res) => {
                if (res.results === null) {
                    this.apiobj.emitChange(false, 'hasplanenoise');
                } else {
                    this.apiobj.emitChange(true, 'hasplanenoise');
                    this.apiobj.emitChange(res.results.data, 'planenoise');
                }
            }, () => { }, () => console.log('planenoise done'));
            this.macro.getPolygons(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res, 'polygons');
            }, () => { }, () => {
                console.log('Map polygons done');
                this.featureReadyService.emitIsReady(true, 'general');
            });
        });
    }

    public onChange(event) {
        if (event.target.value === '' && this.global.addressSearch === true) {
            this.global.addressSearch = false;
        }
    }
}
