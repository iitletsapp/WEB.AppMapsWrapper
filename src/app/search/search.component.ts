import { Component, ElementRef, ViewChild, OnInit, NgZone } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { GetMarkerService } from '../../services/getmarker.service';
import { GetAddressService } from '../../services/getaddress.service';
import { ProgressBarService } from '../../services/progressbar.service';
import { } from '@types/googlemaps';
import { MacroService } from '../../services/macro.service';
import { GetMunicipalityService } from '../../services/getmunicipality.service';
import { Globals } from '../globals';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

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
        public global: Globals
    ) {
        this.getAddress.changeEmitted$.subscribe((newAddress) => {
            this.address = newAddress;
        });
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

    public goto() {
        if (!this.address) {
            this.global.addressSearch = false;
            return;
        }
        this.progressbar.startProgressBar();
        this.global.addressSearch = true;
        setTimeout(() => {
            this.getMarker.emitChange([this.lat, this.lng]);
            this.getAddress.setFormatedAddress(this.address);
            this.progressbar.endProgressBar();
        }, 200);
        this.macro.getLocationInfo(this.lat, this.lng).subscribe(() => {
            this.macro.getMunicipalityInfo(this.lat, this.lng).subscribe((res) => {
                this.apiobj.emitChange(res.townInfo, 'general');
            }, (error) => {
                console.log(error);
            }, () => {
                this.macro.getPopulation(this.lat, this.lng).subscribe((res) => {
                    this.apiobj.emitChange(res.municipalityPopulationEvolutionIndex, 'population');
                });
                this.macro.getTax(this.lat, this.lng).subscribe((res) => {
                    this.apiobj.emitChange(res.municipalityTaxCharge, 'tax');
                });
                this.macro.getHousingMarket(this.lat, this.lng).subscribe((res) => {
                    this.apiobj.emitChange(res.municipalityPrivateRealEstatePriceIndex, 'housingMarket');
                    this.apiobj.emitChange(res.housingAreaMarketConstructionActivity, 'housingMarketConstructionActivity');
                    this.apiobj.emitChange(res.housingAreaMarketVacancyRate[4].municipalityValue, 'housingMarketVacancy');
                });
                this.macro.getStreetNoise(this.lat, this.lng).subscribe((res) => {
                    this.apiobj.emitChange(res.results.data, 'streetnoise');
                });
                this.macro.getRailNoise(this.lat, this.lng).subscribe((res) => {
                    this.apiobj.emitChange(res.results.data, 'railnoise');
                });
                this.macro.getPlaneNoise(this.lat, this.lng).subscribe((res) => {
                    this.apiobj.emitChange(res.results.data, 'planenoise');
                });
            });

        });
    }

    public onChange(event) {
        if (event.target.value === '' && this.global.addressSearch === true) {
            this.global.addressSearch = false;
        }
    }
}
