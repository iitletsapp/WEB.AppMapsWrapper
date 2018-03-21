import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MapService } from '../../services/map.service';
import { GeocodingService } from '../../services/geocoding.service';
import { GetMarkerService } from '../../services/getmarker.service';
import { GetAddressService } from '../../services/getaddress.service';
import { Globals} from '../globals'

declare const google: any;

@Component({
    selector: 'app-geolocation',
    templateUrl: 'geolocation.component.html',
    styleUrls: ['geolocation.component.scss']
})

export class GeoLocationComponent implements OnInit {
    public loading: boolean = false;

    constructor(
        private mapService: MapService,
        private ngZone: NgZone,
        private getMarker: GetMarkerService,
        private geoCoding: GeocodingService,
        private getAddress: GetAddressService,
        public global:Globals
    ) { }

    public ngOnInit() { /* */ }

    public gobacktomarker() {
        this.loading = !this.loading;

        if (!!navigator.geolocation) {

            this.ngZone.run((cb) => {

                navigator.geolocation.getCurrentPosition((position) => {

                    const geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    this.mapService.map.setCenter(geolocate);
                    this.getMarker.emitChange([position.coords.latitude, position.coords.longitude]);
                    this.loading = !this.loading;
                    this.geoCoding.regeocode(this.getMarker.position[0], this.getMarker.position[1])
                        .subscribe((location) => {
                            this.getAddress.emitChange(location.address);
                            this.getAddress.setFormatedAddress(location.address);
                            this.loading = false;
                        });
                });
            });
        } else {
            alert('No Geolocation Support');
            this.loading = false;
        }

    }
}
